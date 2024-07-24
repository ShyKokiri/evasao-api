const http = require("http");
const cors = require("cors");

const fs = require("fs");
//read files
const csvParser = require("csv-parser");

//upload files
const multer = require("multer");
const upload = multer({ dest: "tmp/files/" });

//express - server
const express = require("express");
const app = express();
app.use(cors());

const Router = express.Router;
const router = new Router();

const server = http.createServer(app);
const port = 9000;

//services
const GeradorDeTaxa = require("./src/service/GeradorDeTaxa.js");

//convertores
const {
  converterIngressosParaObjetos,
  converterEgressosParaObjetos,
  converterMatriculasParaObjetos,
  converterExcluidosParaObjetos,
} = require("./src/converters/conversores.js");

//data
const saidaJson = require("./saida.json");

//Listas

let listEgressos = [];
let listIngressos = [];
let listMatriculas = [];
let listExcluidos = [];

router.post("/ingressos", upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  listIngressos = await converterIngressosParaObjetos(req.file);

  res.json(listIngressos);
});

router.post("/egressos", upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  listEgressos = await converterEgressosParaObjetos(req.file);

  res.json(listEgressos);
});

router.get("/calc", (req, res) => {
  // realizar o calc da evasao
  if (
    listEgressos.length == 0 ||
    listIngressos.length == 0 ||
    listMatriculas.length == 0 ||
    listExcluidos.length == 0
  ) {
    res.status(500).json({
      erro: "É necessário fazer o upload de todas as planilhas",
    });
  } else {
    let gerenciadorDeTaxa = new GeradorDeTaxa();
    let resultadoEvasao = gerenciadorDeTaxa.gerarTaxaEvasao(
      listIngressos,
      listEgressos,
      listExcluidos,
      listMatriculas
    );
    clearCache();
    res.json(resultadoEvasao);
  }
});

router.get("/calcsucesso", (req, res) => {
  if (listEgressos.length == 0 || listIngressos.length == 0) {
    res.status(500).json({
      erro: "É necessário fazer upload das planilhas Lista de Engressos e Ingressor",
    });
  } else {
    let nomeCurso = req.query.curso;

    let gerenciadorDeTaxa = new GeradorDeTaxa();
    let resultadoSucesso = gerenciadorDeTaxa.gerarTaxaSucesso(
      nomeCurso,
      listEgressos,
      listIngressos
    );

    res.json(resultadoSucesso);
  }
});

// ajuste router.post("/matriculas" para receber o arquivo em XLSX

router.post(
  "/matriculas-xlsx",
  upload.single("file"),
  async function (req, res) {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    listMatriculas = await converterMatriculasParaObjetos(req.file);

    res.json(listMatriculas);

    //how to set the key of the object
  }
);

router.post("/excluidos", upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  listExcluidos = await converterExcluidosParaObjetos(req.file);
  //console.log(listExcluidos)
  res.json(listExcluidos);

  //how to set the key of the object
});

app.use("/upload", router);

function startServer() {
  server.listen(port, function () {
    console.log("Express server listening on ", port);
  });
}

function clearCache(req, res) {
  listEgressos = [];
  listIngressos = [];
  listMatriculas = [];
  listExcluidos = [];
}

setImmediate(startServer);
