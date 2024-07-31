module.exports = class GeradorDeTaxa {
  constructor() {}

  getExcluidos(ano, listExcluidos) {
    const result = listExcluidos
      .filter((e) => e.ano === ano)
      .reduce((acc, obj) => {
        return acc + parseInt(obj.total_periodo);
      }, 0);

    return result;
    //return listExcluidos.find((e) => e.ano === ano).total_periodo;

    //total_periodo 2010 1  - 100
    //total_periodo 2010 2   - 90
  }

  getMatriculados(ano, listMatriculas) {
    const result = listMatriculas
      .filter((e) => e.ano === ano)
      .reduce((acc, obj) => {
        return acc + parseInt(obj.matriculas);
      }, 0);
    return result;
  }
  //* as planilhas já vem com curso filtrado
  gerarTaxaEvasao(arrAnos, listExcluidos, listMatriculas) {
    const taxasEvasao = [];

    arrAnos.forEach((ano) => {
      let taxaEvasao =
        (this.getExcluidos(ano, listExcluidos) /
          this.getMatriculados(ano, listMatriculas)) *
        100;
      if (!isNaN(taxaEvasao)) taxaEvasao = parseFloat(taxaEvasao).toFixed(2);
      taxasEvasao.push({
        ano,
        taxaEvasao,
      });
    });

    console.log("Gerando evasao ....");
    console.log(taxasEvasao);
    return taxasEvasao;
  }

  //as planilham vem com todos os cursos
  gerarTaxaSucesso(arrAnos, nomeCurso, listEgressos, listIngressos) {
    //criar um filtro de cursos aqui
    //1) Obter o nome do curso a ser fitrado

    const arrIngressosFiltrado = listIngressos.filter(
      (item) => item.curso == nomeCurso
    );

    const arrEgressosFiltrado = listEgressos.filter(
      (item) => item.curso == nomeCurso
    );

    //2) Buscar por todos os anos  deste curso em ingressos

    const arraySucesso = [];
    arrAnos.forEach((ano) => {
      const filtroIngressosAnoCurso = arrIngressosFiltrado.filter((ing) => {
        return ing.ano == ano;
      });
      const somaIng = filtroIngressosAnoCurso.reduce((acc, obj) => {
        return acc + parseInt(obj.qtd_ingressos);
      }, 0);

      let ingresso = { soma: somaIng, ano };

      const filtroEgressoAnoCurso = arrEgressosFiltrado.filter((ing) => {
        return ing.ano == ano;
      });
      const somaEgr = filtroEgressoAnoCurso.reduce((acc, obj) => {
        return acc + parseInt(obj.qtd_egressos);
      }, 0);

      let egresso = { soma: somaEgr, ano };

      let taxaSucesso = egresso.soma / ingresso.soma;
      if (!isNaN(taxaSucesso)) taxaSucesso = parseFloat(taxaSucesso).toFixed(2);
      let sucesso = {
        ano,
        taxaSucesso,
      };

      //TODO: Separar por unidade,
      // pensar como resolver a soma anual quando o numero de semestres de ingressos é diferente de egressos.

      arraySucesso.push(sucesso);
    });

    console.log("Gerando sucesso ....");
    console.log(arraySucesso);

    return arraySucesso;

    //3) Buscar por todos os anos  deste curso em egressos

    //4) Calular as taxas por ano do curso
    //5) Guardar em um array de resultados
  }

  gerarTaxas(
    nomeCurso,
    listEgressos,
    listIngressos,
    listExcluidos,
    listMatriculas
  ) {
    let arrAnos = new Set(listExcluidos.map((e) => e.ano));

    const arrTaxasSucesso = this.gerarTaxaSucesso(
      arrAnos,
      nomeCurso,
      listEgressos,
      listIngressos
    ); //[ { ano: 2010, taxaSucesso: 10.5}, { ano: 2012,  taxaSucesso:15.5}]

    const arrTaxasEvasao = this.gerarTaxaEvasao(
      arrAnos,
      listExcluidos,
      listMatriculas
    );
    ////[ { ano: 2010, taxaEvasao:10.5}, { ano: 2012, taxaEvasao: 15.5}]

    const taxaTotal = [];

    arrAnos.forEach((ano) => {
      const sucesso = arrTaxasSucesso.find((tx) => tx.ano == ano);
      const evasao = arrTaxasEvasao.find((tx) => tx.ano == ano);
      const taxa = {
        taxaSucesso: sucesso.taxaSucesso,
        taxaEvasao: evasao.taxaEvasao,
        curso: nomeCurso,
        ano,
      };
      taxaTotal.push(taxa);
    });
    console.log(taxaTotal);
    return taxaTotal;
  }
};
