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

    //2) Buscar por todos os anos  deste curso em ingressos

    const anos = [2010, 2011, 2012, 2013];
    const arraySucesso = [];
    anos.forEach((ano) => {
      const filtroIngressosAnoCurso = arrIngressosFiltrado.filter((ing) => {
        return ing.ano == ano;
      });
      const somaIng = filtroIngressosAnoCurso.reduce((acc, obj) => {
        return acc + parseInt(obj.qtd_ingressos);
      }, 0);

      let ingresso = { soma: somaIng, ano, nomeCurso };
      //Shape do Resultado esperado
      // let ingresso = {
      //   ano: ano,
      //   soma: 90,
      //   unidade: "Facom",
      //   curso: "Ciencia Computacao",
      // };

      const filtroEgressoAnoCurso = arrEgressosFiltrado.filter((ing) => {
        return ing.ano == ano;
      });
      const somaEgr = filtroEgressoAnoCurso.reduce((acc, obj) => {
        return acc + parseInt(obj.qtd_egressos);
      }, 0);

      let egresso = { soma: somaEgr, ano, nomeCurso };

      //Shape do Resultado esperado
      // let egresso = {
      //   ano: ano,
      //   soma: 90,
      //   unidade: "Facom",
      //   curso: "Ciencia Computacao",
      // };
      const taxa = egresso.soma / ingresso.soma;
      let sucesso = {
        ano: ano,
        curso: nomeCurso,
        taxa,
      };

      //TODO: Separar por unidade,
      // pensar como resolver a soma anual quando o numero de semestres de ingressos é diferente de egressos.

      arraySucesso.push(sucesso);
    });

    return arraySucesso;

    //3) Buscar por todos os anos  deste curso em egressos

    //4) Calular as taxas por ano do curso
    //5) Guardar em um array de resultados
  }
};
