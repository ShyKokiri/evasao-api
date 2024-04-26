const fs = require("fs");
//read files
const csvParser = require("csv-parser");
const Ingresso = require("../model/Ingresso.js")
const Egresso = require("../model/Egresso.js")

function  converterIngressosParaObjetos(file){
   
  return new Promise((resolve, reject) => {

      try{

     
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
        resolve(ingressos)

      }catch(e){
        reject(e)
      }
   
    })
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

    function converterEgressosParaObjetos(file){
      const fileRows = [];
      const egressos=[];
      const readableStream = fs.createReadStream(file.path)
            .pipe(csvParser());
      readableStream
        .on("data", function (data) {
          fileRows.push(data); // push each row
        })
        .on("end", function () {
          console.log("---------converterEgressosParaObjetos--------")
          
          fileRows.forEach( (row)=>{
            console.log(row)
              
            //convert cada row em OBjeto Dados do Egresso 
             let egresso =  converteRowParaEgresso(row)
            
            // //Adiciona no array de Egressos
             egressos.push(egresso)
          })
         
        });
        return egressos
     
      }
  
  function converteRowParaEgresso(row){
        
          let egresso = new Egresso()
          egresso.ano = row.ano
          egresso.qtd_egressos = row.qtd_egressos
          egresso.curso = row.curso
          egresso.semestre = row.semestre
          egresso.unidade = row.unidade
  
          return egresso
  
        }
  
      module.exports = {  converterEgressosParaObjetos, converterIngressosParaObjetos }