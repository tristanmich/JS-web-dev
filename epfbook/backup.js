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

// Environment variable authentification
app.use(
    basicAuth({
      users: { [process.env.ADMIN_USERNAME]: process.env.ADMIN_PASSWORD},
      challenge: true
    })
  );

// Function to determine the authentification
function clearPasswordAuthorizer(username, password, cb) {
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
    const foundUser = users.find(user => user.username === username);
    if (!foundUser) 
      return cb(null, false);
    else 
      if (foundUser.password == password)
        return cb(null, true);
      else 
        return cb(null, false);
  });
}

// Function to determine the authentification
function myAsyncAuthorizer(username, password, cb) {
  if (username.startsWith('A') & password.startsWith('secret'))
      return cb(null, true)
  else
      return cb(null, false)
}