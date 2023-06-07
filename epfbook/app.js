// Web programming LAB
// Tristan MICHELENA
// EPF 4A Data Engineering
// 06/07/2023

// Add the constances
const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
// Enable EJS Templates 
const ejs = require('ejs');
// Authentification
const basicAuth = require('express-basic-auth');

// Define the engine
app.set('views','./views');
app.set('view engine','ejs')

// Print the port in the console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Initialize the authentification
app.use(basicAuth({
  authorizer: encryptedPasswordAuthorizer,
  authorizeAsync: true,
  challenge: true
}))
// Enable static files loading
app.use(express.static("public"));
// Define the encoding => URL Extension
app.use(express.urlencoded({ extended: true }));

// Function to determine the authentification
function encryptedPasswordAuthorizer(username, password, cb) {
  // Read the CSV file
  fs.readFile('user.csv', 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    // Split the lines
    var lines = data.split('\n');
    // Split the header
    const header = lines[0].split(',');
    // Create a list of users
    var users = [];
    // Loop on the lines
    for(let i = 1; i < lines.length; i++) {
      // Create a dict with all the usernames and passwords
      var values = lines[i].split(',');
      var dict = {};
      dict[header[0]] = values[0].replace('\\n', '');
      dict[header[1]] = values[1];
      users.push(dict);
    }
    // Find the username in the list
    const storedUser = users.find((possibleUser) => {
      return basicAuth.safeCompare(possibleUser.username, username);
    });
    // If username not found
    if (!storedUser) {
      cb(null, false);
    } else {
      // Compare the hash password
      bcrypt.compare(password, storedUser.password, cb);
    }
  });
}

// GET method route for home
app.get('/home', function (req, res) {
  res.render('home');
});

// GET method route for student details test page
app.get('/student/details', (req, res) => {
  const student = {
      name: "Student name",
      school: "EPF"
  };
  res.render('student_details', { student });
});

// GET method route for test page
app.get('/test', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Test page</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>
  `);
});

// GET method route for home redirection
app.get('/', (req, res) => {
  res.redirect("/home");
});

// GET method route for data about students
app.get('/students/data', (req, res) => {
  res.render('students_data');
});

// GET method route for list of students
app.get('/students', (req, res) => {
  // Use the function to send the student data from the CSV
  dataFromCsvFile('Sheet_school.csv', (err, students) => {
    if (err) {
      console.error(err);
      res.send("ERROR");
      return;
    }
    res.render("students", {
      students,
    });
  });
});

// GET method route for creating a new student
app.get('/student/create', (req, res) => {
  res.render('create-student');
});

// POST method route for creating a new student
// Create new student storing data
app.post('/student/create', (req, res) => {
  // console.log(req.body);
  // console.log(req.body.name, req.body.school);
  // Get the student data
  const csvLine =`\n${req.body.name},${req.body.school}`;
  // console.log(csvLine);
  // Write the new student data
  fs.writeFile('Sheet_school.csv', csvLine, {
    encoding: "utf8",
    flag: "a"
  }, (err) => {
    if (err) throw err; {
      console.log(err)
    } 
    // Redirect the user
    res.redirect("/student/create?created=1");
  });
});

// GET method route for student details
// Define a route for /students/:id
app.get('/students/:id', (req, res) => {
  // Get the id of the student
  const id = parseInt(req.params.id);
  // Get the student data
  dataFromCsvFile('Sheet_school.csv', (err, students) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }
    // If the id matches with the line
    if (id >= 0 && id < students.length) {
      const student = students[id];
      res.render('student_details', { student, id });
    } else {
      res.send('Student not found');
    }
  });
});

// POST method route for student updated details
// Update the student information
app.post('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Read the CSV file and parse it as JSON object
  fs.readFile('Sheet_school.csv', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }
    // Split the data into lines
    const lines = data.split('\n');
    // Parse the header
    const header = lines[0].split(',');
    // Create an array to store the updated student data
    const updatedStudents = [];
    // Loop over the lines
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      // Create a JSON object for each student
      const student = {
        name: values[0],
        school: values[1]
      };
      // If the current line is the one, update
      if (i === id + 1) {
        student.name = req.body.name;
        student.school = req.body.school;
      }
      // Add the student to the array
      updatedStudents.push(student);
    }
    // Convert the array to CSV format
    const updatedCsv = `${header.join(',')}\n${updatedStudents
      .map(student => `${student.name},${student.school}`)
      .join('\n')}`;
    // Write the updated CSV content
    fs.writeFile('Sheet_school.csv', updatedCsv, 'utf8', err => {
      if (err) {
        res.status(500).send('Internal server error');
        return;
      }
      res.redirect(`/students/${id}`);
    });
  });
});

// Function to send a list of students from Sheet_school.csv
function dataFromCsvFile(name, callback) {
  // Read the data from the CSV
  fs.readFile(name, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    // Split the data into lines
    var lines = data.split('\n');
    // Parse the header
    const header = lines[0].split(',');
    // Create an array to store the student data
    var list = [];
    // Loop over the lines
    for(let i = 1; i < lines.length; i++) {
      // Add the data to the dict for each student
      var values = lines[i].split(',');
      var dict = {};
      dict[header[0]] = values[0].replace('\\n', '');
      dict[header[1]] = values[1];
      list.push(dict);
    }
    callback(null, list);
  });
}

////// API \\\\\\
// GET method route /api/student
app.get('/api/student', function (req, res) {
  res.send(["My name is Tristan and I try to understand the Get method", 
  {name:"Tristan", school:"EPF"}]);
});

// GET method route /api/students
app.get('/api/students', function (req, res) {
  fs.readFile('Sheet_school.csv', 'utf8', (err, data) => {
    if (err) throw err; {
      console.log(data);
  }
  var lines = data.split('\n');
  const header = lines[0].split(',');
  var list = [];
  for(let i = 1; i < lines.length-1; i++) {
    var values = lines[i].split(',');
    var dict = {};
    dict[header[0]] = values[0].replace('\\n', '');
    dict[header[1]] = values[1];
    list.push(dict);
  }
  res.set('Content-Type', 'text/html');
  res.send(list);
  });
});

// POST method route /api/students/create
app.use(express.json())
app.post('/api/student/create', function (req, res, next) {
  console.log(req.body.name, req.body.school);
  const csvLine =`${req.body.name},${req.body.school}`;
  console.log(csvLine);
  fs.writeFile('Sheet_school.csv', csvLine, {
    encoding: "utf8",
    flag: "a"
  }, (err) => {
    if (err) throw err; {
      console.log(err)
    } 
    res.json("Student created");
  });
});
