/* =====================================================
   GESTÃO SAUDÁVEL
   PAINEL DO GESTOR
===================================================== */

let empresaAtual = null;
let gestorAtual = null;
let graficoIcpo = null;

const VALOR_ICPR = 80;

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", iniciarPainelGestor);

function iniciarPainelGestor() {
    if (!protegerPagina()) {
        return;
    }

    configurarNavegacao();
    configurarEventosGerais();
    carregarCabecalho();
    carregarDadosEmpresa();
    atualizarDashboard();
}

/* =====================================================
   PROTEÇÃO DA PÁGINA
===================================================== */

function protegerPagina() {
    const nomeEmpresa = obterEmpresaAtual();
    const usuarioLogado = obterUsuarioLogado();

    if (!nomeEmpresa || !usuarioLogado) {
        window.location.href = "index.html";
        return false;
    }

    empresaAtual = buscarEmpresa(nomeEmpresa);

    if (!empresaAtual || !Array.isArray(empresaAtual.funcionarios)) {
        encerrarSessao();
        window.location.href = "index.html";
        return false;
    }

    gestorAtual = empresaAtual.funcionarios.find(funcionario =>
        funcionario.usuario === usuarioLogado
    );

    if (!gestorAtual || gestorAtual.tipo !== "gestor") {
        encerrarSessao();
        window.location.href = "index.html";
        return false;
    }

    return true;
}

/* =====================================================
   NAVEGAÇÃO
===================================================== */

function configurarNavegacao() {
    const itensMenu = document.querySelectorAll(".menu-item");
    const linksInternos = document.querySelectorAll("[data-abrir-pagina]");

    itensMenu.forEach(item => {
        item.addEventListener("click", () => {
            abrirPagina(item.dataset.pagina);
        });
    });

    linksInternos.forEach(link => {
        link.addEventListener("click", () => {
            abrirPagina(link.dataset.abrirPagina);
        });
    });
}

function abrirPagina(nomePagina) {
    const paginas = document.querySelectorAll(".app-page");
    const itensMenu = document.querySelectorAll(".menu-item");

    paginas.forEach(pagina => pagina.classList.remove("ativa"));
    itensMenu.forEach(item => item.classList.remove("ativo"));

    const paginaSelecionada = document.getElementById(nomePagina);
    const itemSelecionado = document.querySelector(
        `.menu-item[data-pagina="${nomePagina}"]`
    );

    if (!paginaSelecionada) {
        return;
    }

    paginaSelecionada.classList.add("ativa");

    if (itemSelecionado) {
        itemSelecionado.classList.add("ativo");
    }

    if (nomePagina === "dashboard") {
        atualizarDashboard();
    }

    if (nomePagina === "funcionarios") {
        atualizarPaginaFuncionarios();
    }

    if (nomePagina === "relatorios") {
        atualizarRelatorios();
    }

    if (nomePagina === "empresa") {
        carregarDadosEmpresa();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =====================================================
   EVENTOS GERAIS
===================================================== */

function configurarEventosGerais() {
    const btnSair = document.getElementById("btnSair");
    const periodoGrafico = document.getElementById("periodoGrafico");
    const btnFiltrarRelatorios = document.getElementById(
        "btnFiltrarRelatorios"
    );
    const btnExportarRelatorio = document.getElementById(
        "btnExportarRelatorio"
    );
    const btnNovoFuncionario = document.getElementById(
        "btnNovoFuncionario"
    );
    const btnFecharModal = document.getElementById("btnFecharModal");
    const btnCancelarFuncionario = document.getElementById(
        "btnCancelarFuncionario"
    );
    const modalFuncionario = document.getElementById("modalFuncionario");
    const formFuncionario = document.getElementById("formFuncionario");
    const buscaFuncionario = document.getElementById("buscaFuncionario");
    const filtroSetor = document.getElementById("filtroSetor");
    const tabelaFuncionarios = document.getElementById(
        "tabelaFuncionarios"
    );

    btnSair?.addEventListener("click", sairDoSistema);

    periodoGrafico?.addEventListener("change", atualizarGraficoIcpo);

    btnFiltrarRelatorios?.addEventListener("click", atualizarRelatorios);

    btnExportarRelatorio?.addEventListener(
        "click",
        exportarRelatorioCsv
    );

    btnNovoFuncionario?.addEventListener(
        "click",
        abrirModalNovoFuncionario
    );

    btnFecharModal?.addEventListener("click", fecharModalFuncionario);

    btnCancelarFuncionario?.addEventListener(
        "click",
        fecharModalFuncionario
    );

    modalFuncionario?.addEventListener("click", event => {
        if (event.target === modalFuncionario) {
            fecharModalFuncionario();
        }
    });

    formFuncionario?.addEventListener(
        "submit",
        salvarFormularioFuncionario
    );

    buscaFuncionario?.addEventListener(
        "input",
        aplicarFiltrosFuncionarios
    );

    filtroSetor?.addEventListener(
        "change",
        aplicarFiltrosFuncionarios
    );

    tabelaFuncionarios?.addEventListener(
        "click",
        controlarAcaoFuncionario
    );

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fecharModalFuncionario();
        }
    });
}

function sairDoSistema() {
    encerrarSessao();
    window.location.href = "index.html";
}

/* =====================================================
   CABEÇALHO
===================================================== */

function carregarCabecalho() {
    atualizarTexto("nomeGestor", obterPrimeiroNome(gestorAtual.nome));
    atualizarTexto("nomeEmpresa", empresaAtual.nome);
    atualizarTexto("ramoEmpresa", empresaAtual.ramo || "Área de atuação");
    atualizarTexto("dataAtual", formatarDataCompleta(new Date()));
}

function obterPrimeiroNome(nomeCompleto) {
    return String(nomeCompleto || "Gestor")
        .trim()
        .split(" ")[0];
}

function formatarDataCompleta(data) {
    return data.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

/* =====================================================
   EMPRESA
===================================================== */

function carregarDadosEmpresa() {
    recarregarEmpresa();

    atualizarTexto("empresaPerfilNome", empresaAtual.nome);
    atualizarTexto("empresaPerfilRamo", empresaAtual.ramo || "—");
    atualizarTexto("empresaDadosNome", empresaAtual.nome);
    atualizarTexto("empresaDadosCnpj", empresaAtual.cnpj || "—");
    atualizarTexto("empresaDadosRamo", empresaAtual.ramo || "—");
    atualizarTexto(
        "empresaDadosCadastro",
        formatarDataSimples(empresaAtual.dataCadastro)
    );
}

function recarregarEmpresa() {
    const empresaRecarregada = buscarEmpresa(obterEmpresaAtual());

    if (empresaRecarregada) {
        empresaAtual = empresaRecarregada;
    }
}

function formatarDataSimples(data) {
    if (!data) {
        return "—";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "—";
    }

    return dataConvertida.toLocaleDateString("pt-BR");
}

/* =====================================================
   DASHBOARD
===================================================== */

function atualizarDashboard() {
    recarregarEmpresa();

    const funcionarios = obterFuncionariosMonitorados();
    const registros = obterRegistrosDaEquipe(funcionarios);
    const hoje = formatarDataChave(new Date());

    const registrosHoje = registros.filter(item =>
        obterDataRegistro(item.registro) === hoje
    );

    const estadosAtuais = calcularEstadosAtuais(funcionarios);
    const icpo = calcularMedia(estadosAtuais.pontuacoes);

    atualizarTexto("valorIcpo", icpo);
    atualizarTexto("valorIcpr", VALOR_ICPR);
    atualizarTexto("totalFuncionarios", funcionarios.length);
    atualizarTexto("registrosHoje", registrosHoje.length);
    atualizarTexto("totalDispostos", estadosAtuais.dispostos);
    atualizarTexto("totalNeutros", estadosAtuais.neutros);
    atualizarTexto(
        "totalSobrecarregados",
        estadosAtuais.sobrecarregados
    );

    atualizarVariacaoIcpo(icpo, estadosAtuais.pontuacoes.length);
    atualizarStatusEmpresa(icpo, estadosAtuais.pontuacoes.length);
    atualizarUltimaAtualizacao(registros);
    atualizarUltimosRegistros(registros);
    atualizarRecomendacoes(icpo, estadosAtuais);
    atualizarGraficoIcpo();
}

/* =====================================================
   FUNCIONÁRIOS E REGISTROS
===================================================== */

function obterTodosFuncionarios() {
    if (!empresaAtual || !Array.isArray(empresaAtual.funcionarios)) {
        return [];
    }

    return empresaAtual.funcionarios.filter(funcionario =>
        funcionario.tipo !== "gestor"
    );
}

function obterFuncionariosMonitorados() {
    return obterTodosFuncionarios().filter(
        funcionario => funcionario.ativo !== false
    );
}

function obterRegistrosDaEquipe(funcionarios) {
    return funcionarios.flatMap(funcionario => {
        const registros = Array.isArray(funcionario.registros)
            ? funcionario.registros
            : [];

        return registros.map(registro => ({
            funcionario,
            registro
        }));
    });
}

function obterUltimoRegistro(funcionario, dataEspecifica = null) {
    const registros = Array.isArray(funcionario.registros)
        ? funcionario.registros
        : [];

    const registrosFiltrados = dataEspecifica
        ? registros.filter(registro =>
            obterDataRegistro(registro) === dataEspecifica
        )
        : registros;

    if (registrosFiltrados.length === 0) {
        return null;
    }

    return [...registrosFiltrados].sort(
        (registroA, registroB) =>
            obterDataHoraRegistro(registroB) -
            obterDataHoraRegistro(registroA)
    )[0];
}

/* =====================================================
   ESTADOS E ICPO
===================================================== */

function calcularEstadosAtuais(funcionarios) {
    const resultado = {
        dispostos: 0,
        neutros: 0,
        sobrecarregados: 0,
        semRegistro: 0,
        pontuacoes: []
    };

    funcionarios.forEach(funcionario => {
        const ultimoRegistro = obterUltimoRegistro(funcionario);

        if (!ultimoRegistro) {
            resultado.semRegistro++;
            return;
        }

        const estado = normalizarEstado(ultimoRegistro.estado);
        const pontuacao = pontuarEstado(estado);

        if (estado === "disposto") {
            resultado.dispostos++;
        } else if (estado === "neutro") {
            resultado.neutros++;
        } else if (estado === "sobrecarregado") {
            resultado.sobrecarregados++;
        }

        if (pontuacao !== null) {
            resultado.pontuacoes.push(pontuacao);
        }
    });

    return resultado;
}

function normalizarEstado(estado) {
    return normalizarTexto(estado);
}

function pontuarEstado(estado) {
    const pontuacoes = {
        disposto: 100,
        neutro: 60,
        sobrecarregado: 20
    };

    return pontuacoes[estado] ?? null;
}

function calcularMedia(valores) {
    if (!valores.length) {
        return 0;
    }

    const soma = valores.reduce(
        (total, valor) => total + valor,
        0
    );

    return Math.round(soma / valores.length);
}

/* =====================================================
   SITUAÇÃO DA EMPRESA
===================================================== */

function atualizarStatusEmpresa(icpo, totalComRegistro) {
    const painel = document.querySelector(".dashboard-status");
    const icone = document.getElementById("statusEmpresaIcone");
    const titulo = document.getElementById("statusEmpresaTitulo");
    const texto = document.getElementById("statusEmpresaTexto");

    if (!painel || !icone || !titulo || !texto) {
        return;
    }

    painel.classList.remove(
        "status-estavel",
        "status-atencao",
        "status-critico",
        "status-sem-dados"
    );

    if (totalComRegistro === 0) {
        painel.classList.add("status-sem-dados");
        icone.innerHTML = '<i class="fa-solid fa-clock"></i>';
        titulo.textContent = "Aguardando registros";
        texto.textContent =
            "Os indicadores serão calculados após os primeiros registros.";
        return;
    }

    if (icpo >= VALOR_ICPR) {
        painel.classList.add("status-estavel");
        icone.innerHTML =
            '<i class="fa-solid fa-circle-check"></i>';
        titulo.textContent = "Saúde psicossocial estável";
        texto.textContent =
            "Os indicadores da empresa estão dentro do esperado.";
        return;
    }

    if (icpo >= 60) {
        painel.classList.add("status-atencao");
        icone.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i>';
        titulo.textContent = "Indicadores exigem atenção";
        texto.textContent =
            "Alguns registros precisam ser acompanhados pelo gestor.";
        return;
    }

    painel.classList.add("status-critico");
    icone.innerHTML =
        '<i class="fa-solid fa-circle-exclamation"></i>';
    titulo.textContent = "Situação psicossocial crítica";
    texto.textContent =
        "Os indicadores estão abaixo do nível recomendado.";
}

function atualizarVariacaoIcpo(icpo, totalComRegistro) {
    const elemento = document.getElementById("variacaoIcpo");

    if (!elemento) {
        return;
    }

    if (totalComRegistro === 0) {
        elemento.textContent = "Sem registros disponíveis";
        return;
    }

    const diferenca = icpo - VALOR_ICPR;

    if (diferenca === 0) {
        elemento.textContent = "Igual ao índice de referência";
    } else if (diferenca > 0) {
        elemento.textContent = `+${diferenca} acima da referência`;
    } else {
        elemento.textContent = `${diferenca} abaixo da referência`;
    }
}

/* =====================================================
   ÚLTIMA ATUALIZAÇÃO E REGISTROS RECENTES
===================================================== */

function atualizarUltimaAtualizacao(registros) {
    const elemento = document.getElementById("ultimaAtualizacao");

    if (!elemento) {
        return;
    }

    if (registros.length === 0) {
        elemento.textContent = "Sem registros";
        return;
    }

    const ultimoItem = [...registros].sort(
        (itemA, itemB) =>
            obterDataHoraRegistro(itemB.registro) -
            obterDataHoraRegistro(itemA.registro)
    )[0];

    const registro = ultimoItem.registro;
    const dataRegistro = obterDataRegistro(registro);
    const hoje = formatarDataChave(new Date());

    if (dataRegistro === hoje) {
        elemento.textContent = `Hoje, ${registro.horario || "--:--"}`;
        return;
    }

    elemento.textContent =
        `${formatarDataBrasileira(dataRegistro)}, ` +
        `${registro.horario || "--:--"}`;
}

function atualizarUltimosRegistros(registros) {
    const lista = document.getElementById("listaUltimosRegistros");

    if (!lista) {
        return;
    }

    const registrosOrdenados = [...registros]
        .sort(
            (itemA, itemB) =>
                obterDataHoraRegistro(itemB.registro) -
                obterDataHoraRegistro(itemA.registro)
        )
        .slice(0, 5);

    if (registrosOrdenados.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-folder-open"></i>
                <h3>Nenhum registro encontrado</h3>
                <p>Os registros dos funcionários aparecerão aqui.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = registrosOrdenados.map(item => {
        const estado = item.registro.estado || "Sem registro";
        const data = formatarDataBrasileira(
            obterDataRegistro(item.registro)
        );

        return `
            <div class="recommendation-item"
                 style="background:var(--background);align-items:center;">

                <div class="recommendation-icon"
                     style="background:var(--primary);">
                    <i class="fa-solid fa-clock"></i>
                </div>

                <div style="flex:1;">
                    <strong>${escaparHtml(item.funcionario.nome)}</strong>
                    <p>
                        ${escaparHtml(item.registro.momento || "Registro")} ·
                        ${data} às ${escaparHtml(
                            item.registro.horario || "--:--"
                        )}
                    </p>
                </div>

                <span class="state-badge ${obterClasseEstado(estado)}">
                    ${escaparHtml(estado)}
                </span>

            </div>
        `;
    }).join("");
}

function atualizarRecomendacoes(icpo, estadosAtuais) {
    const lista = document.getElementById("listaRecomendacoes");

    if (!lista) {
        return;
    }

    if (estadosAtuais.pontuacoes.length === 0) {
        lista.innerHTML = criarRecomendacaoHtml(
            "fa-clock",
            "Aguardando registros",
            "As recomendações aparecerão quando a equipe começar a registrar a jornada.",
            "#6B7280",
            "rgba(107,114,128,.10)"
        );
        return;
    }

    if (icpo >= VALOR_ICPR) {
        lista.innerHTML = criarRecomendacaoHtml(
            "fa-circle-check",
            "Indicadores estáveis",
            "Continue acompanhando os registros e mantendo as ações positivas da empresa.",
            "#4CAF50",
            "rgba(76,175,80,.10)"
        );
        return;
    }

    if (icpo >= 60) {
        lista.innerHTML = criarRecomendacaoHtml(
            "fa-triangle-exclamation",
            "Acompanhe a equipe",
            "Converse com os funcionários e observe os setores com mais registros neutros ou sobrecarregados.",
            "#D99A00",
            "rgba(255,193,7,.14)"
        );
        return;
    }

    lista.innerHTML = criarRecomendacaoHtml(
        "fa-circle-exclamation",
        "Ação recomendada",
        "Analise os registros recentes e planeje medidas para reduzir a sobrecarga da equipe.",
        "#F44336",
        "rgba(244,67,54,.10)"
    );
}

function criarRecomendacaoHtml(
    icone,
    titulo,
    texto,
    cor,
    fundo
) {
    return `
        <div class="recommendation-item" style="background:${fundo};">

            <div class="recommendation-icon" style="background:${cor};">
                <i class="fa-solid ${icone}"></i>
            </div>

            <div>
                <strong>${escaparHtml(titulo)}</strong>
                <p>${escaparHtml(texto)}</p>
            </div>

        </div>
    `;
}

/* =====================================================
   GRÁFICO DO ICPO
===================================================== */

function atualizarGraficoIcpo() {
    const canvas = document.getElementById("graficoIcpo");

    if (!canvas || typeof Chart === "undefined") {
        return;
    }

    const seletorPeriodo = document.getElementById("periodoGrafico");
    const dias = Number(seletorPeriodo?.value || 7);
    const serie = gerarSerieIcpo(dias);

    if (graficoIcpo) {
        graficoIcpo.destroy();
    }

    graficoIcpo = new Chart(canvas, {
        type: "line",

        data: {
            labels: serie.labels,

            datasets: [
                {
                    label: "ICPO",
                    data: serie.valores,
                    borderColor: "#5B5FEF",
                    backgroundColor: "rgba(91,95,239,.12)",
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    spanGaps: true
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                intersect: false,
                mode: "index"
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label(context) {
                            if (context.raw === null) {
                                return "Sem registros";
                            }

                            return `ICPO: ${context.raw}`;
                        }
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,

                    ticks: {
                        stepSize: 20
                    },

                    grid: {
                        color: "rgba(0,0,0,.05)"
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function gerarSerieIcpo(dias) {
    const funcionarios = obterFuncionariosMonitorados();
    const labels = [];
    const valores = [];

    for (let distancia = dias - 1; distancia >= 0; distancia--) {
        const data = new Date();

        data.setHours(0, 0, 0, 0);
        data.setDate(data.getDate() - distancia);

        const dataChave = formatarDataChave(data);

        const pontuacoesDoDia = funcionarios
            .map(funcionario => {
                const registro = obterUltimoRegistro(
                    funcionario,
                    dataChave
                );

                if (!registro) {
                    return null;
                }

                return pontuarEstado(
                    normalizarEstado(registro.estado)
                );
            })
            .filter(pontuacao => pontuacao !== null);

        labels.push(
            data.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit"
            })
        );

        valores.push(
            pontuacoesDoDia.length
                ? calcularMedia(pontuacoesDoDia)
                : null
        );
    }

    return {
        labels,
        valores
    };
}

/* =====================================================
   PÁGINA DE FUNCIONÁRIOS
===================================================== */

function atualizarPaginaFuncionarios() {
    recarregarEmpresa();

    const funcionarios = obterTodosFuncionarios();
    const hoje = formatarDataChave(new Date());

    const funcionariosAtivos = funcionarios.filter(
        funcionario => funcionario.ativo !== false
    );

    const registraramHoje = funcionarios.filter(funcionario =>
        Boolean(obterUltimoRegistro(funcionario, hoje))
    ).length;

    atualizarTexto("resumoTotalFuncionarios", funcionarios.length);
    atualizarTexto(
        "resumoFuncionariosAtivos",
        funcionariosAtivos.length
    );
    atualizarTexto("resumoRegistrosHoje", registraramHoje);

    atualizarFiltroSetores(funcionarios);
    aplicarFiltrosFuncionarios();
}

function preencherTabelaFuncionarios(funcionarios) {
    const tabela = document.getElementById("tabelaFuncionarios");
    const estadoVazio = document.getElementById("funcionariosVazio");

    if (!tabela || !estadoVazio) {
        return;
    }

    tabela.innerHTML = "";

    if (funcionarios.length === 0) {
        estadoVazio.style.display = "block";
        return;
    }

    estadoVazio.style.display = "none";

    funcionarios.forEach(funcionario => {
        const ultimoRegistro = obterUltimoRegistro(funcionario);
        const estado = ultimoRegistro
            ? ultimoRegistro.estado
            : "Sem registro";

        const ultimoRegistroTexto = ultimoRegistro
            ? `${formatarDataBrasileira(
                obterDataRegistro(ultimoRegistro)
            )} às ${escaparHtml(ultimoRegistro.horario || "--:--")}`
            : "—";

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>
                <div class="employee-name">

                    <div class="employee-avatar">
                        ${obterIniciais(funcionario.nome)}
                    </div>

                    <div>
                        <strong>${escaparHtml(funcionario.nome)}</strong>
                        <span>@${escaparHtml(funcionario.usuario)}</span>
                    </div>

                </div>
            </td>

            <td>${escaparHtml(funcionario.setor || "—")}</td>

            <td>${escaparHtml(funcionario.cargo || "—")}</td>

            <td>
                <span class="state-badge ${obterClasseEstado(estado)}">
                    ${escaparHtml(estado)}
                </span>
            </td>

            <td>${ultimoRegistroTexto}</td>

            <td>
                <div class="table-actions">

                    <button
                        type="button"
                        class="table-action"
                        data-acao="editar"
                        data-id="${escaparHtml(funcionario.id)}"
                        title="Editar funcionário">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        type="button"
                        class="table-action delete"
                        data-acao="excluir"
                        data-id="${escaparHtml(funcionario.id)}"
                        title="Excluir funcionário">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

/* =====================================================
   FILTROS DE FUNCIONÁRIOS
===================================================== */

function atualizarFiltroSetores(funcionarios) {
    const filtroSetor = document.getElementById("filtroSetor");

    if (!filtroSetor) {
        return;
    }

    const valorAtual = filtroSetor.value;

    const setores = [...new Set(
        funcionarios
            .map(funcionario => String(funcionario.setor || "").trim())
            .filter(Boolean)
    )].sort((setorA, setorB) =>
        setorA.localeCompare(setorB, "pt-BR")
    );

    filtroSetor.innerHTML = `
        <option value="">Todos os setores</option>
    `;

    setores.forEach(setor => {
        const option = document.createElement("option");

        option.value = setor;
        option.textContent = setor;

        filtroSetor.appendChild(option);
    });

    if (setores.includes(valorAtual)) {
        filtroSetor.value = valorAtual;
    }
}

function aplicarFiltrosFuncionarios() {
    const funcionarios = obterTodosFuncionarios();

    const busca = normalizarTexto(
        document.getElementById("buscaFuncionario")?.value
    );

    const setorSelecionado = normalizarTexto(
        document.getElementById("filtroSetor")?.value
    );

    const funcionariosFiltrados = funcionarios.filter(funcionario => {
        const nome = normalizarTexto(funcionario.nome);
        const usuario = normalizarTexto(funcionario.usuario);
        const setor = normalizarTexto(funcionario.setor);
        const cargo = normalizarTexto(funcionario.cargo);

        const correspondeBusca =
            !busca ||
            nome.includes(busca) ||
            usuario.includes(busca) ||
            setor.includes(busca) ||
            cargo.includes(busca);

        const correspondeSetor =
            !setorSelecionado || setor === setorSelecionado;

        return correspondeBusca && correspondeSetor;
    });

    preencherTabelaFuncionarios(funcionariosFiltrados);
}

/* =====================================================
   MODAL DE FUNCIONÁRIO
===================================================== */

function abrirModalNovoFuncionario() {
    const form = document.getElementById("formFuncionario");
    const campoId = document.getElementById("funcionarioId");
    const campoSenha = document.getElementById("senhaFuncionario");
    const titulo = document.getElementById("tituloModalFuncionario");

    if (!form || !campoId || !campoSenha) {
        return;
    }

    form.reset();
    campoId.value = "";
    campoSenha.required = true;
    campoSenha.placeholder = "Mínimo de 4 caracteres";

    if (titulo) {
        titulo.textContent = "Novo funcionário";
    }

    abrirModalFuncionario();
}

function abrirModalEdicaoFuncionario(funcionarioId) {
    const funcionario = buscarFuncionarioPorId(
        empresaAtual.nome,
        funcionarioId
    );

    if (!funcionario) {
        mostrarMensagem("Funcionário não encontrado.", "erro");
        return;
    }

    const campoId = document.getElementById("funcionarioId");
    const campoNome = document.getElementById("nomeFuncionario");
    const campoSetor = document.getElementById("setorFuncionario");
    const campoCargo = document.getElementById("cargoFuncionario");
    const campoUsuario = document.getElementById("usuarioFuncionario");
    const campoSenha = document.getElementById("senhaFuncionario");
    const titulo = document.getElementById("tituloModalFuncionario");

    if (
        !campoId ||
        !campoNome ||
        !campoSetor ||
        !campoCargo ||
        !campoUsuario ||
        !campoSenha
    ) {
        return;
    }

    campoId.value = funcionario.id;
    campoNome.value = funcionario.nome || "";
    campoSetor.value = funcionario.setor || "";
    campoCargo.value = funcionario.cargo || "";
    campoUsuario.value = funcionario.usuario || "";
    campoSenha.value = "";
    campoSenha.required = false;
    campoSenha.placeholder = "Deixe vazio para manter a senha atual";

    if (titulo) {
        titulo.textContent = "Editar funcionário";
    }

    abrirModalFuncionario();
}

function abrirModalFuncionario() {
    const modal = document.getElementById("modalFuncionario");

    if (!modal) {
        return;
    }

    modal.classList.add("ativo");
    document.body.classList.add("modal-aberto");

    setTimeout(() => {
        document.getElementById("nomeFuncionario")?.focus();
    }, 100);
}

function fecharModalFuncionario() {
    const modal = document.getElementById("modalFuncionario");

    if (!modal || !modal.classList.contains("ativo")) {
        return;
    }

    modal.classList.remove("ativo");
    document.body.classList.remove("modal-aberto");
}

/* =====================================================
   SALVAR FUNCIONÁRIO
===================================================== */

function salvarFormularioFuncionario(event) {
    event.preventDefault();

    const campoId = document.getElementById("funcionarioId");
    const campoNome = document.getElementById("nomeFuncionario");
    const campoSetor = document.getElementById("setorFuncionario");
    const campoCargo = document.getElementById("cargoFuncionario");
    const campoUsuario = document.getElementById("usuarioFuncionario");
    const campoSenha = document.getElementById("senhaFuncionario");

    if (
        !campoId ||
        !campoNome ||
        !campoSetor ||
        !campoCargo ||
        !campoUsuario ||
        !campoSenha
    ) {
        return;
    }

    const funcionarioId = campoId.value;

    const dadosFuncionario = {
        nome: campoNome.value.trim(),
        setor: campoSetor.value.trim(),
        cargo: campoCargo.value.trim(),
        usuario: campoUsuario.value.trim(),
        senha: campoSenha.value
    };

    if (
        !dadosFuncionario.nome ||
        !dadosFuncionario.setor ||
        !dadosFuncionario.cargo ||
        !dadosFuncionario.usuario
    ) {
        mostrarMensagem(
            "Preencha todos os campos obrigatórios.",
            "erro"
        );
        return;
    }

    if (!funcionarioId && dadosFuncionario.senha.length < 4) {
        mostrarMensagem(
            "A senha precisa ter pelo menos 4 caracteres.",
            "erro"
        );
        return;
    }

    if (
        funcionarioId &&
        dadosFuncionario.senha &&
        dadosFuncionario.senha.length < 4
    ) {
        mostrarMensagem(
            "A nova senha precisa ter pelo menos 4 caracteres.",
            "erro"
        );
        return;
    }

    const resultado = funcionarioId
        ? editarFuncionario(
            empresaAtual.nome,
            funcionarioId,
            dadosFuncionario
        )
        : cadastrarFuncionario(
            empresaAtual.nome,
            dadosFuncionario
        );

    if (!resultado.sucesso) {
        mostrarMensagem(resultado.mensagem, "erro");
        return;
    }

    fecharModalFuncionario();
    recarregarEmpresa();
    atualizarPaginaFuncionarios();
    atualizarDashboard();
    mostrarMensagem(resultado.mensagem, "sucesso");
}

/* =====================================================
   AÇÕES DA TABELA
===================================================== */

function controlarAcaoFuncionario(event) {
    const botao = event.target.closest("[data-acao][data-id]");

    if (!botao) {
        return;
    }

    const acao = botao.dataset.acao;
    const funcionarioId = botao.dataset.id;

    if (acao === "editar") {
        abrirModalEdicaoFuncionario(funcionarioId);
    } else if (acao === "excluir") {
        solicitarExclusaoFuncionario(funcionarioId);
    }
}

function solicitarExclusaoFuncionario(funcionarioId) {
    const funcionario = buscarFuncionarioPorId(
        empresaAtual.nome,
        funcionarioId
    );

    if (!funcionario) {
        mostrarMensagem("Funcionário não encontrado.", "erro");
        return;
    }

    const confirmou = window.confirm(
        `Excluir o funcionário "${funcionario.nome}"?\n\n` +
        "Os registros dele também serão apagados."
    );

    if (!confirmou) {
        return;
    }

    const resultado = excluirFuncionario(
        empresaAtual.nome,
        funcionarioId
    );

    if (!resultado.sucesso) {
        mostrarMensagem(resultado.mensagem, "erro");
        return;
    }

    recarregarEmpresa();
    atualizarPaginaFuncionarios();
    atualizarDashboard();
    mostrarMensagem(resultado.mensagem, "sucesso");
}

/* =====================================================
   RELATÓRIOS
===================================================== */

function obterRegistrosFiltrados() {
    const funcionarios = obterTodosFuncionarios();
    let registros = obterRegistrosDaEquipe(funcionarios);

    const dataInicial = document.getElementById(
        "filtroDataInicio"
    )?.value;

    const dataFinal = document.getElementById(
        "filtroDataFim"
    )?.value;

    const estadoSelecionado = normalizarEstado(
        document.getElementById("filtroEstado")?.value
    );

    registros = registros.filter(item => {
        const dataRegistro = obterDataRegistro(item.registro);
        const estadoRegistro = normalizarEstado(item.registro.estado);

        if (dataInicial && dataRegistro < dataInicial) {
            return false;
        }

        if (dataFinal && dataRegistro > dataFinal) {
            return false;
        }

        if (estadoSelecionado && estadoRegistro !== estadoSelecionado) {
            return false;
        }

        return true;
    });

    return registros.sort(
        (itemA, itemB) =>
            obterDataHoraRegistro(itemB.registro) -
            obterDataHoraRegistro(itemA.registro)
    );
}

function atualizarRelatorios() {
    recarregarEmpresa();

    const registros = obterRegistrosFiltrados();

    const pontuacoes = registros
        .map(item =>
            pontuarEstado(normalizarEstado(item.registro.estado))
        )
        .filter(valor => valor !== null);

    const funcionariosMonitorados = new Set(
        registros.map(item => String(item.funcionario.id))
    );

    atualizarTexto("totalRegistrosRelatorio", registros.length);
    atualizarTexto("mediaIcpoRelatorio", calcularMedia(pontuacoes));
    atualizarTexto(
        "funcionariosMonitorados",
        funcionariosMonitorados.size
    );

    preencherTabelaRelatorios(registros);
}

function preencherTabelaRelatorios(registros) {
    const tabela = document.getElementById("tabelaRelatorios");
    const estadoVazio = document.getElementById("relatoriosVazio");

    if (!tabela || !estadoVazio) {
        return;
    }

    tabela.innerHTML = "";

    if (registros.length === 0) {
        estadoVazio.style.display = "block";
        return;
    }

    estadoVazio.style.display = "none";

    registros.forEach(item => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>
                ${formatarDataBrasileira(
                    obterDataRegistro(item.registro)
                )}
            </td>

            <td>${escaparHtml(item.registro.horario || "—")}</td>

            <td>${escaparHtml(item.funcionario.nome)}</td>

            <td>${escaparHtml(item.registro.momento || "—")}</td>

            <td>
                <span class="state-badge ${obterClasseEstado(
                    item.registro.estado
                )}">
                    ${escaparHtml(item.registro.estado || "—")}
                </span>
            </td>

            <td>${escaparHtml(item.registro.observacao || "—")}</td>
        `;

        tabela.appendChild(linha);
    });
}

function exportarRelatorioCsv() {
    recarregarEmpresa();

    const registros = obterRegistrosFiltrados();

    if (registros.length === 0) {
        mostrarMensagem(
            "Não existem registros para exportar.",
            "erro"
        );
        return;
    }

    const linhas = [
        [
            "Data",
            "Horário",
            "Funcionário",
            "Setor",
            "Cargo",
            "Momento",
            "Estado atual",
            "Observação"
        ]
    ];

    registros.forEach(item => {
        linhas.push([
            formatarDataBrasileira(
                obterDataRegistro(item.registro)
            ),
            item.registro.horario || "",
            item.funcionario.nome || "",
            item.funcionario.setor || "",
            item.funcionario.cargo || "",
            item.registro.momento || "",
            item.registro.estado || "",
            item.registro.observacao || ""
        ]);
    });

    const conteudoCsv = linhas
        .map(linha => linha.map(escaparCsv).join(";"))
        .join("\n");

    const blob = new Blob(
        [`\uFEFF${conteudoCsv}`],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nomeArquivo = normalizarTexto(empresaAtual.nome)
        .replace(/\s+/g, "-") || "empresa";

    link.href = url;
    link.download =
        `relatorio-${nomeArquivo}-${formatarDataChave(new Date())}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    mostrarMensagem("Relatório exportado com sucesso.", "sucesso");
}

/* =====================================================
   DATAS
===================================================== */

function formatarDataChave(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function obterDataRegistro(registro) {
    return String(registro?.data || "").slice(0, 10);
}

function obterDataHoraRegistro(registro) {
    const data = obterDataRegistro(registro);
    const horario = registro?.horario || "00:00";
    const partesData = data.split("-").map(Number);
    const partesHorario = horario.split(":").map(Number);

    if (
        partesData.length !== 3 ||
        partesData.some(numero => Number.isNaN(numero))
    ) {
        return 0;
    }

    return new Date(
        partesData[0],
        partesData[1] - 1,
        partesData[2],
        partesHorario[0] || 0,
        partesHorario[1] || 0
    ).getTime();
}

function formatarDataBrasileira(data) {
    const partes = String(data || "").split("-");

    if (partes.length !== 3) {
        return data || "—";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function obterIniciais(nome) {
    const partes = String(nome || "")
        .trim()
        .split(" ")
        .filter(Boolean);

    if (partes.length === 0) {
        return "?";
    }

    if (partes.length === 1) {
        return partes[0][0].toUpperCase();
    }

    return (
        partes[0][0] + partes[partes.length - 1][0]
    ).toUpperCase();
}

function obterClasseEstado(estado) {
    const estadoNormalizado = normalizarEstado(estado);

    if (estadoNormalizado === "disposto") {
        return "disposto";
    }

    if (estadoNormalizado === "neutro") {
        return "neutro";
    }

    if (estadoNormalizado === "sobrecarregado") {
        return "sobrecarregado";
    }

    return "sem-registro";
}

function normalizarTexto(texto) {
    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function atualizarTexto(id, valor) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function escaparHtml(texto) {
    const elemento = document.createElement("div");

    elemento.textContent = String(texto ?? "");

    return elemento.innerHTML;
}

function escaparCsv(valor) {
    const texto = String(valor ?? "").replace(/"/g, '""');

    return `"${texto}"`;
}

/* =====================================================
   NOTIFICAÇÕES
===================================================== */

function mostrarMensagem(texto, tipo) {
    let mensagem = document.querySelector(".mensagem");

    if (!mensagem) {
        mensagem = document.createElement("div");
        mensagem.className = "mensagem";
        document.body.appendChild(mensagem);
    }

    mensagem.textContent = texto;
    mensagem.classList.remove("erro", "sucesso", "mostrar");
    mensagem.classList.add(tipo);

    requestAnimationFrame(() => {
        mensagem.classList.add("mostrar");
    });

    clearTimeout(mensagem._temporizador);

    mensagem._temporizador = setTimeout(() => {
        mensagem.classList.remove("mostrar");
    }, 3000);
}