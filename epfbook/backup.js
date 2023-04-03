// GET method for list of students without using a function
app.get('/students', (req, res) => {
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
});