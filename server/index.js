// Create express server
const express = require("express");
const app = express();

const hostname = "127.0.0.1";
const port = 8080;

//default get
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Prints a log once the server starts listening
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
