const fs = require("fs");
const xlsx = require("xlsx");
//read files
const csvParser = require("csv-parser");
const Ingresso = require("../model/Ingresso.js");
const Egresso = require("../model/Egresso.js");
const Matricula = require("../model/Matricula.js");
const Excluido = require("../model/Excluido.js");

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
          fileRows.forEach((row) => {
            let ingresso = converteRowParaIngresso(row);
            ingressos.push(ingresso);
          });
          resolve(ingressos);
        });
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
          fileRows.forEach((row) => {
            let egresso = converteRowParaEgresso(row);
            egressos.push(egresso);
          });
          resolve(egressos);
        });
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

function isNumber(value) {
  return !isNaN(value);
}

// function converterMatriculasParaObjetosOld(file) {
//   return new Promise((resolve, reject) => {
//     try {
//       let matriculas = [];
//       const workbook = xlsx.readFile(file.path);
//       const sheet_name_list = workbook.SheetNames;
//       let xlData = xlsx.utils.sheet_to_json(
//         workbook.Sheets[sheet_name_list[0]]
//       );

//       xlData.forEach((row) => {
//         if (isNumber(row.__EMPTY_3) || isNumber(row.__EMPTY_4)) {
//           let matricula = new Matricula();
//           matricula.ano = row.__EMPTY.split("/")[0];
//           matricula.semestre = row.__EMPTY.split("/")[1];
//           matricula.faculdade = row.__EMPTY_1;
//           matricula.curso = row.__EMPTY_2;
//           matricula.matriculas = row.__EMPTY_3;
//           matricula.total = row.__EMPTY_4;
//           matriculas.push(matricula);
//         }
//       });
//       resolve(matriculas);
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

function converterMatriculasParaObjetos(file) {
  return new Promise((resolve, reject) => {
    try {
      let matriculas = [];
      const workbook = xlsx.readFile(file.path);
      const sheet_name_list = workbook.SheetNames;
      let xlData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );

      xlData.forEach((row) => {
        if (isNumber(row.__EMPTY_4) || isNumber(row.__EMPTY_5)) {
          let matricula = new Matricula();
          matricula.periodo = row["Totalização de Acadêmicos por Situação"];
          matricula.situacao = row.__EMPTY;
          matricula.ano = row.__EMPTY_1.split("/")[0];
          matricula.semestre = row.__EMPTY_1.split("/")[1];
          matricula.unidade = row.__EMPTY_2;
          matricula.curso = row.__EMPTY_3;
          matricula.total_periodo = row.__EMPTY_4;
          matricula.total_curso = row.__EMPTY_5;
          matricula.total_unidade = row.__EMPTY_6;
          matricula.total_ocorrencia = row.__EMPTY_7;
          matricula.total_ano = row.__EMPTY_8;
          matricula.total = row.__EMPTY_9;
          matriculas.push(matricula);
        }
      });
      resolve(matriculas);
    } catch (error) {
      reject(error);
    }
  });
}

function converterExcluidosParaObjetos(file) {
  return new Promise((resolve, reject) => {
    try {
      let excluidos = [];
      const workbook = xlsx.readFile(file.path);
      const sheet_name_list = workbook.SheetNames;
      let xlData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheet_name_list[0]]
      );

      xlData.forEach((row) => {
        if (isNumber(row.__EMPTY_4) || isNumber(row.__EMPTY_5)) {
          let excluido = new Excluido();
          excluido.periodo = row["Totalização de Acadêmicos por Situação"];
          excluido.situacao = row.__EMPTY;
          excluido.ano = row.__EMPTY_1.split("/")[0];
          excluido.semestre = row.__EMPTY_1.split("/")[1];
          excluido.unidade = row.__EMPTY_2;
          excluido.curso = row.__EMPTY_3;
          excluido.total_periodo = row.__EMPTY_4;
          excluido.total_curso = row.__EMPTY_5;
          excluido.total_unidade = row.__EMPTY_6;
          excluido.total_ocorrencia = row.__EMPTY_7;
          excluido.total_ano = row.__EMPTY_8;
          excluido.total = row.__EMPTY_9;
          excluidos.push(excluido);
        }
      });
      resolve(excluidos);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  converterEgressosParaObjetos,
  converterIngressosParaObjetos,
  converterMatriculasParaObjetos,
  converterExcluidosParaObjetos,
};
