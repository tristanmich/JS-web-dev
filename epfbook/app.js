const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// GET method route
app.get('/student', function (req, res) {
  res.send(["My name is Tristan and I try to understand the Get method", 
  {name:"Tristan", school:"EPF"}]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
