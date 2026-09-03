const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();

app.get("/run", (req, res) => {
  exec(req.query.cmd, (error, stdout) => {
    if (error) return res.status(500).send(error.message);
    res.send(stdout);
  });
});

app.get("/file", (req, res) => {
  fs.readFile(req.query.path, "utf8", (error, data) => {
    if (error) return res.status(404).send("File not found");
    res.send(data);
  });
});

app.listen(3000, () => console.log("Demo app listening on port 3000"));
