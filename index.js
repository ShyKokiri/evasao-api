const http = require("http");
const fs = require("fs");
const evasionCalc = require("./evasion-service.js");
const saidaJson = require("./saida.json")

const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");

const Router = express.Router;

const upload = multer({ dest: "tmp/csv/" });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;

router.post("/ingressos", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileRows = [];
  const readableStream = fs.createReadStream(req.file.path)
        .pipe(csvParser());
  readableStream
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows); //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path); // remove temp file
      res.send("Finished reading csv file")
      //process "fileRows" and respond
    });
});

router.post("/egressos", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileRows = [];
  const readableStream = fs.createReadStream(req.file.path)
        .pipe(csvParser());
  readableStream
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows); //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path); // remove temp file
      res.send("Finished reading csv file")
      //process "fileRows" and respond
    });
});

router.post("/matriculas", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const fileRows = [];
  const readableStream = fs.createReadStream(req.file.path)
        .pipe(csvParser());
  readableStream
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {
      console.log(fileRows); //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
      fs.unlinkSync(req.file.path); // remove temp file
      res.send("Finished reading csv file")
      //process "fileRows" and respond
    });
});

router.get("/evasion-calc", function(req, res){
  evasionCalc()
  res.json(saidaJson)
})

app.use("/upload-csv", router);

function startServer() {
  server.listen(port, function () {
    console.log("Express server listening on ", port);
  });
}

setImmediate(startServer);
