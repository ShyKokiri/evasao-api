const fs = require("fs");
const xlsx = require("xlsx");
//read files
const csvParser = require("csv-parser");
const Ingresso = require("../model/Ingresso.js");
const Egresso = require("../model/Egresso.js");
const Matricula = require("../model/Matricula.js");

function converterIngressosParaObjetos(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileRows = [];
      const ingressos = [];
      const readableStream = fs.createReadStream(file.path).pipe(csvParser());
      readableStream
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", function () {
          console.log("---------converterIngressosParaObjetos--------");

          fileRows.forEach((row) => {
            console.log(row);

            //convert cada row em OBjeto Dados do Egresso
            let ingresso = converteRowParaIngresso(row);

            // //Adiciona no array de Egressos
            ingressos.push(ingresso);
          });
        });
      resolve(ingressos);
    } catch (e) {
      reject(e);
    }
  });
}

function converteRowParaIngresso(row) {
  let ingresso = new Ingresso();
  ingresso.ano = row.ano;
  ingresso.qtd_ingressos = row.qtd_ingressos;
  ingresso.curso = row.curso;
  ingresso.semestre = row.semestre;
  ingresso.unidade = row.unidade;

  return ingresso;
}

function converterEgressosParaObjetos(file) {
  return new Promise((resolve, reject) => {
    try {
      const fileRows = [];
      const egressos = [];
      const readableStream = fs.createReadStream(file.path).pipe(csvParser());
      readableStream
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", function () {
          console.log("---------converterEgressosParaObjetos--------");

          fileRows.forEach((row) => {
            console.log(row);

            //convert cada row em OBjeto Dados do Egresso
            let egresso = converteRowParaEgresso(row);

            // //Adiciona no array de Egressos
            egressos.push(egresso);
          });
        });
      resolve(egressos);
    } catch (e) {
      reject(e);
    }
  });
}

function converteRowParaEgresso(row) {
  let egresso = new Egresso();
  egresso.ano = row.ano;
  egresso.qtd_egressos = row.qtd_egressos;
  egresso.curso = row.curso;
  egresso.semestre = row.semestre;
  egresso.unidade = row.unidade;

  return egresso;
}

function isNumber (value){
    return !isNaN(value)
}
function converterMatriculasParaObjetos(file) {
  let matriculas = [];
  const workbook = xlsx.readFile(file.path);
  const sheet_name_list = workbook.SheetNames;
  let xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  //let keys = ["ano", "faculdade", "curso", "excluidos", "total_excluidos"];

  xlData = xlData.forEach((row) => {
    if (isNumber(row.__EMPTY_3) || isNumber(row.__EMPTY_4) ){
      let matricula = new Matricula()
      matricula.ano= row.__EMPTY
      matricula.faculdade = row.__EMPTY_1
      matricula.curso = row.__EMPTY_2
      matricula.matriculas = row.__EMPTY_3
      matricula.total = row.__EMPTY_4
      matriculas.push(matricula)
    }
    

 //mais 

   
  });
  return matriculas;
}

module.exports = {
  converterEgressosParaObjetos,
  converterIngressosParaObjetos,
  converterMatriculasParaObjetos
};
