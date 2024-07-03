module.exports = class GeradorDeTaxa {
  constructor() {}
  gerarTaxaEvasao(listIngressos, listEgressos) {
    console.log("Gerando evasao ....");
    return [
      {
        ano: 2010,
        taxaSucesso: 50,
        taxaEvasao: 50,
      },
      {
        ano: 2010,
        taxaSucesso: 50,
        taxaEvasao: 50,
      },
    ];
  }
};
