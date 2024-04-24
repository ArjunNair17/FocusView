// Create express server
const express = require("express");
const app = express();

const hostname = "127.0.0.1";
const port = 8080;

// Create HTTP server
// const server = http.createServer(function (req, res) {
//   // Set the response HTTP header with HTTP status and Content type
//   res.writeHead(200, { "Content-Type": "text/plain" });

//   // Send the response body "Hello World"
//   res.end("Hello World\n");
// });

//default get
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Prints a log once the server starts listening
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
