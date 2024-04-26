module.exports=  class GeradorDeTaxa{
    constructor(){
       
    }
    gerarTaxaEvasao(listaIngressos){
        console.log("Gerando evasao ....")
        return {
            taxa:(listaIngressos.length/100)+"%"
        }
    }   
}