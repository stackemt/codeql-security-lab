const express = require("express");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/run", (req, res) => {
  const command = String(req.query.cmd || "");

  if (command === "date") {
    return res.send(new Date().toISOString());
  }

  if (command === "uptime") {
    return res.send(String(process.uptime()));
  }

  return res.status(400).send("Unsupported command");
});

const allowedFiles = {
  about: path.join(__dirname, "public", "about.txt")
};

app.get("/file", (req, res) => {
  const requestedFile = String(req.query.name || "");
  const filePath = allowedFiles[requestedFile];

  if (!filePath) {
    return res.status(404).send("File not found");
  }

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) return res.status(404).send("File not found");
    res.type("text/plain").send(data);
  });
});

app.listen(3000, () => console.log("Demo app listening on port 3000"));
