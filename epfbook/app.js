const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

app.set('views','./views');
app.set('view engine','ejs')

// GET method route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// GET method route
app.get('/students', (req, res) => {
  getStudentsFromCsvFile((err, students) => {
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


/*app.get('/students', (req, res) => {
  fs.readFile('Sheet_school.csv', 'utf8', (err, data) => {
    if (err) throw err;
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
    res.render("students", { students: list });
  });
});*/

function getStudentsFromCsvFile(callback) {
  fs.readFile('Sheet_school.csv', 'utf8', (err, data) => {
    if (err) {
      callback(err);
      return;
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
    
    callback(null, list);
  });
}

// GET method route
app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname,"./views/home.html"));
});

// GET method route
app.get('/api/student', function (req, res) {
  res.send(["My name is Tristan and I try to understand the Get method", 
  {name:"Tristan", school:"EPF"}]);
});

// GET method route
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

// POST method route
app.use(express.json())
app.post('/api/students/create', function (req, res, next) {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
