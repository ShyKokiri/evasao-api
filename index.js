const http = require("http");
const fs = require("fs");

//read files
const csvParser = require("csv-parser");
const xlsx = require("xlsx");

//upload files
const multer = require("multer");
const upload = multer({ dest: "tmp/files/" });

//express - server
const express = require("express");
const app = express();
const Router = express.Router;
const router = new Router();


const server = http.createServer(app);
const port = 9000;

//services
const evasionCalc = require("./evasion-service.js");

//data
const saidaJson = require("./saida.json")


router.post("/ingressos", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  let listIngressos = converterIngressosParaObjetos (req.file)
  
  // console.log(listaIngressos)

  // let gt = new GeradorDeTaxa()
  // let resultadoEvasao = gt.gerarEvasao(listIngressos, listaX, listaY, listaZ)
  // res.json(resultadoEvasao)


  //  fs.unlinkSync(req.file.path); // remove temp file
  //res.send("Finished reading csv file")

});


 function converterIngressosParaObjetos(file){
  const fileRows = [];
  const egressos=[];
  const readableStream = fs.createReadStream(req.file.path)
        .pipe(csvParser());
  readableStream
    .on("data", function (data) {
      fileRows.push(data); // push each row
    })
    .on("end", function () {

      let arrayEngressos = []
      fileRows.forEach( (row)=>{

        //convert cada row em OBjeto Dados do Egresso 
        let egresso =  converteRowParaEgresso(row)
        console.log(row)

        //Adiciona no array de Egressos
        egressos.push(egresso)
      })
     
    });
    return egressos
 
  }

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

// ajuste router.post("/matriculas" para receber o arquivo em XLSX


router.post("/matriculas-xlsx", upload.single("file"), function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const workbook = xlsx.readFile(req  .file.path);
  const sheet_name_list = workbook.SheetNames;
  let xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]] );

  let keys = ["ano", "faculdade", "curso", "excluidos", "total_excluidos"]

  xlData = xlData.map(row => {
    const newRow = {};
    let i = 0;
    for (let key in row) {
       
         
          newRow[keys[i++]] = row[key];
         
    }
    return newRow;
});


  console.log(xlData);
  res.send("Finished reading xlsx file")

  //how to set the key of the object
 
});



// ajuste router.post("/matriculas" para receber o arquivo em CSV


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

app.use("/upload", router);

function startServer() {
  server.listen(port, function () {
    console.log("Express server listening on ", port);
  });
}

setImmediate(startServer);


//solve the problem: Error: Cannot find module 'multer-xlsx'  by running the command: npm install multer-xlsx