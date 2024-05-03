module.exports=  class GeradorDeTaxa{
    constructor(){
       
    }
    gerarTaxaEvasao(listIngressos, listEgressos){
        console.log("Gerando evasao ....")
        return {
            taxa:50,
            listIngressos,
            listEgressos
        }
    }  

}