module.exports = class GeradorDeTaxa {
  constructor() {}

  getExcluidos(ano, listExcluidos) {
    return listExcluidos.find((e) => e.ano === ano).total_periodo;
  }

  getMatriculados(ano, listMatriculas) {
    return listMatriculas.find(e=> e.ano===ano).matriculas
  }
  gerarTaxaEvasao(listIngressos, listEgressos, listExcluidos, listMatriculas) {

    let arrAnos = [];
    listMatriculas.forEach(e=>arrAnos.push(e.ano))
    
    const taxasEvasao = [];

    arrAnos.forEach((ano) => {
      const taxaEvasao =
        (this.getExcluidos(ano, listExcluidos) /
        this.getMatriculados(ano, listMatriculas)) *
        100;

      taxasEvasao.push({
        ano,
        taxaEvasao,
        taxaSucesso: 0,
      });
    });

    console.log("Gerando evasao ....");
    return taxasEvasao;
  }
};
