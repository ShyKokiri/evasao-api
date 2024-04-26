const fs = require("fs");
//read files
const csvParser = require("csv-parser");
const Ingresso = require("../model/Ingresso.js")

function converterIngressosParaObjetos(file){
    const fileRows = [];
    const ingressos=[];
    const readableStream = fs.createReadStream(file.path)
          .pipe(csvParser());
    readableStream
      .on("data", function (data) {
        fileRows.push(data); // push each row
      })
      .on("end", function () {
        console.log("---------converterIngressosParaObjetos--------")
        
        fileRows.forEach( (row)=>{
          console.log(row)
            
          //convert cada row em OBjeto Dados do Egresso 
           let ingresso =  converteRowParaIngresso(row)
          
          // //Adiciona no array de Egressos
           ingressos.push(ingresso)
        })
       
      });
      return ingressos
   
    }

function converteRowParaIngresso(row){
      
        let ingresso = new Ingresso()
        ingresso.ano = row.ano
        ingresso.qtd_ingressos = row.qtd_ingressos
        ingresso.curso = row.curso
        ingresso.semestre = row.semestre
        ingresso.unidade = row.unidade

        return ingresso

      }

    module.exports = {  converterIngressosParaObjetos }