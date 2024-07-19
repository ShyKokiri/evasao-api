module.exports = class GeradorDeTaxa {
  constructor() {}

  getExcluidos(ano, listExcluidos) {
    return listExcluidos.find((e) => e.ano === ano).total_periodo;
  }

  getMatriculados(ano, listMatriculas) {
    return listMatriculas.find((e) => e.ano === ano).matriculas;
  }
  //* as planilhas já vem com curso filtrado
  gerarTaxaEvasao(listIngressos, listEgressos, listExcluidos, listMatriculas) {
    let arrAnos = [];
    listMatriculas.forEach((e) => arrAnos.push(e.ano));

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
  //as planilham vem com todos os cursos
  gerarTaxaSucesso(nomeCurso, listEgressos, listIngressos) {
    //criar um filtro de cursos aqui
    //1) Obter o nome do curso a ser fitrado

    const arrIngressosFiltrado = listIngressos.filter(
      (item) => item.curso == nomeCurso
    );

    const arrEgressosFiltrado = listEgressos.filter(
      (item) => item.curso == nomeCurso
    );

    return { arrIngressosFiltrado, arrEgressosFiltrado };
    //2) Buscar por todos os anos e semestres deste curso em ingressos
    //3) Buscar por todos os anos e semestres deste curso em egressos
    //4) Calular as taxas por ano/sementre do curso
    //5) Guardar em um array de resultados
  }
};
