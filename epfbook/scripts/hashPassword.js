#!/usr/bin/env node
const bcrypt = require("bcrypt");
const readline = require("readline").createInterface({
input: process.stdin,
output: process.stdout,
});
const saltRounds = 10;
readline.question("What is your password? "
, (password) => {
console.log("Your password is:"
, password);
console.log("Starting encryption...");
bcrypt.hash(password, saltRounds, function (err, hash) {
if (err) {
console.error("Could not encrypt your password!"
, err);
}
console.log("Encrypted version of your password: "
, hash);
process.exit(0); // process is a global variable defined by Node
});
});
