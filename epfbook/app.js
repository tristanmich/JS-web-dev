// Add the constances
const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
// Authentification
const basicAuth = require('express-basic-auth');

// Enable EJS Templates 
const ejs = require('ejs');
app.set('views','./views');
app.set('view engine','ejs')

// Initialize the authentification
app.use(basicAuth({
  authorizer: encryptedPasswordAuthorizer,
  authorizeAsync: true,
  challenge: true
}))

// Function to determine the authentification
function encryptedPasswordAuthorizer(username, password, cb) {
  fs.readFile('user.csv', 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    var lines = data.split('\n');
    const header = lines[0].split(',');
    var users = [];
    for(let i = 1; i < lines.length; i++) {
      var values = lines[i].split(',');
      var dict = {};
      dict[header[0]] = values[0].replace('\\n', '');
      dict[header[1]] = values[1];
      users.push(dict);
    }
    const storedUser = users.find((possibleUser) => {
      return basicAuth.safeCompare(possibleUser.username, username);
    });
    if (!storedUser) {
      // username not found
      cb(null, false);
    } else {
      bcrypt.compare(password, storedUser.password, cb);
    }
  });
}

// Serving some HTML as a file
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname,"./views/home.html"));
});

// Enable static files loading
app.use(express.static("public"));
// Define the encoding => URL Extension
app.use(express.urlencoded({ extended: true }));

// Define a route for /students/:id
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  dataFromCsvFile('Sheet_school.csv', (err, students) => {
    if (err) {
      res.status(500).send('Internal server error');
      return;
    }
    if (id >= 0 && id < students.length) {
      const student = students[id];
      res.render('student_details', { student, id });
    } else {
      res.send('Student not found');
    }
  });
});

// GET method route
app.get('/student/details', (req, res) => {
  const student = {
      name: "Student name",
      school: "EPF"
  };
  res.render('student_details', { student });
});

// GET method route
app.get('/test', (req, res) => {
  res.send(`
    <html>
      <head>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>
  `);
});

// GET method route
app.get('/', (req, res) => {
  res.redirect("/home");
});

// GET method route
app.get('/students/data', (req, res) => {
  res.render('students_data');
});

// GET method route
app.get('/students', (req, res) => {
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

// Create new student display
app.get('/student/create', (req, res) => {
  res.render('create-student');
});

// Create new student storing data
app.post('/student/create', (req, res) => {
  console.log(req.body);
  console.log(req.body.name, req.body.school);
  const csvLine =`\n${req.body.name},${req.body.school}`;
  console.log(csvLine);
  fs.writeFile('Sheet_school.csv', csvLine, {
    encoding: "utf8",
    flag: "a"
  }, (err) => {
    if (err) throw err; {
      console.log(err)
    } 
    res.redirect("/student/create?created=1");
  });
});

// Function to send a list of students from Sheet_school.csv
function dataFromCsvFile(name, callback) {
  fs.readFile(name, 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
    }
    var lines = data.split('\n');
    const header = lines[0].split(',');
    var list = [];
    for(let i = 1; i < lines.length; i++) {
      var values = lines[i].split(',');
      var dict = {};
      dict[header[0]] = values[0].replace('\\n', '');
      dict[header[1]] = values[1];
      list.push(dict);
    }
    callback(null, list);
  });
}

/// API
// POST method route
// Authorization: "Bearer <your-token>" , instead of Authorization: "Basic<encoded-username-and-password>"
// using secure cookies
app.post("/api/login", (req, res) => {
  console.log("current cookies:", req.cookies);
  // We assume that you check if the user can login based on "req.body"
  // and then generate an authentication token
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send("OK");
});

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

// Print the port in the console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
