/* =====================================================
   GESTÃO SAUDÁVEL
   ÁREA DO FUNCIONÁRIO
===================================================== */

let empresaAtual = null;
let funcionarioAtual = null;
let temporizadorMensagem = null;
let registroEmAndamento = false;

const MOMENTOS_JORNADA = [
    {
        nome: "Entrada",
        etapaId: "etapaEntrada",
        horarioId: "horarioEntrada"
    },
    {
        nome: "Saída para almoço",
        etapaId: "etapaSaidaAlmoco",
        horarioId: "horarioSaidaAlmoco"
    },
    {
        nome: "Volta do almoço",
        etapaId: "etapaVoltaAlmoco",
        horarioId: "horarioVoltaAlmoco"
    },
    {
        nome: "Saída",
        etapaId: "etapaSaida",
        horarioId: "horarioSaida"
    }
];

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    iniciarAreaFuncionario
);

function iniciarAreaFuncionario() {

    const acessoPermitido = protegerPagina();

    if (!acessoPermitido) {
        return;
    }

    configurarEventos();

    atualizarTela();

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

    if (!empresaAtual) {

        encerrarSessao();

        window.location.href = "index.html";

        return false;

    }

    funcionarioAtual = empresaAtual.funcionarios.find(
        funcionario =>
            funcionario.usuario === usuarioLogado
    );

    if (
        !funcionarioAtual ||
        funcionarioAtual.tipo !== "funcionario" ||
        funcionarioAtual.ativo === false
    ) {

        encerrarSessao();

        window.location.href = "index.html";

        return false;

    }

    return true;

}

/* =====================================================
   EVENTOS
===================================================== */

function configurarEventos() {

    const btnSair = document.getElementById(
        "btnSairFuncionario"
    );

    const btnBaterPonto = document.getElementById(
        "btnBaterPonto"
    );

    const btnFecharModal = document.getElementById(
        "btnFecharModalPonto"
    );

    const btnCancelarPonto = document.getElementById(
        "btnCancelarPonto"
    );

    const modalPonto = document.getElementById(
        "modalPonto"
    );

    const formPonto = document.getElementById(
        "formPonto"
    );

    const filtroHistorico = document.getElementById(
        "filtroHistoricoFuncionario"
    );

    const observacao = document.getElementById(
        "observacaoPonto"
    );

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            sairDoSistema
        );

    }

    if (btnBaterPonto) {

        btnBaterPonto.addEventListener(
            "click",
            abrirModalPonto
        );

    }

    if (btnFecharModal) {

        btnFecharModal.addEventListener(
            "click",
            fecharModalPonto
        );

    }

    if (btnCancelarPonto) {

        btnCancelarPonto.addEventListener(
            "click",
            fecharModalPonto
        );

    }

    if (modalPonto) {

        modalPonto.addEventListener(
            "click",
            event => {

                if (event.target === modalPonto) {

                    fecharModalPonto();

                }

            }
        );

    }

    if (formPonto) {

        formPonto.addEventListener(
            "submit",
            salvarRegistroPonto
        );

    }

    if (filtroHistorico) {

        filtroHistorico.addEventListener(
            "change",
            atualizarHistorico
        );

    }

    if (observacao) {

        observacao.addEventListener(
            "input",
            atualizarContadorObservacao
        );

    }

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                fecharModalPonto();

            }

        }
    );

}

function sairDoSistema() {

    encerrarSessao();

    window.location.href = "index.html";

}

/* =====================================================
   ATUALIZAÇÃO DA TELA
===================================================== */

function atualizarTela() {

    recarregarDados();

    carregarCabecalho();

    atualizarResumoAtual();

    atualizarJornada();

    atualizarHistorico();

}

function recarregarDados() {

    const nomeEmpresa = obterEmpresaAtual();
    const usuarioLogado = obterUsuarioLogado();

    const empresaRecarregada = buscarEmpresa(
        nomeEmpresa
    );

    if (!empresaRecarregada) {
        return;
    }

    empresaAtual = empresaRecarregada;

    const funcionarioRecarregado =
        empresaAtual.funcionarios.find(
            funcionario =>
                funcionario.usuario === usuarioLogado
        );

    if (funcionarioRecarregado) {

        funcionarioAtual = funcionarioRecarregado;

    }

}

/* =====================================================
   CABEÇALHO
===================================================== */

function carregarCabecalho() {

    atualizarTexto(
        "nomeFuncionarioTopo",
        funcionarioAtual.nome
    );

    atualizarTexto(
        "cargoFuncionarioTopo",
        funcionarioAtual.cargo || "Funcionário"
    );

    atualizarTexto(
        "nomeFuncionario",
        obterPrimeiroNome(funcionarioAtual.nome)
    );

    atualizarTexto(
        "avatarFuncionario",
        obterIniciais(funcionarioAtual.nome)
    );

    atualizarTexto(
        "nomeEmpresaFuncionario",
        empresaAtual.nome
    );

    atualizarTexto(
        "dataFuncionario",
        formatarDataCompleta(new Date())
    );

}

function obterPrimeiroNome(nomeCompleto) {

    return String(nomeCompleto || "Funcionário")
        .trim()
        .split(" ")[0];

}

function obterIniciais(nomeCompleto) {

    const partes = String(nomeCompleto || "")
        .trim()
        .split(" ")
        .filter(Boolean);

    if (partes.length === 0) {
        return "F";
    }

    if (partes.length === 1) {

        return partes[0][0].toUpperCase();

    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}

function formatarDataCompleta(data) {

    const texto = data.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );

    return texto.charAt(0).toUpperCase() +
        texto.slice(1);

}

/* =====================================================
   REGISTROS DE HOJE
===================================================== */

function obterRegistrosHoje() {

    const registros = Array.isArray(
        funcionarioAtual.registros
    )
        ? funcionarioAtual.registros
        : [];

    const dataHoje = formatarDataChave(
        new Date()
    );

    return registros.filter(registro =>
        obterDataRegistro(registro) === dataHoje
    );

}

function obterRegistroDoMomento(
    registros,
    nomeMomento
) {

    return registros.find(registro =>
        normalizarTexto(registro.momento) ===
        normalizarTexto(nomeMomento)
    ) || null;

}

function obterProximoMomento() {

    const registrosHoje = obterRegistrosHoje();

    return MOMENTOS_JORNADA.find(momento =>
        !obterRegistroDoMomento(
            registrosHoje,
            momento.nome
        )
    ) || null;

}

/* =====================================================
   ESTADO PSICOSSOCIAL ATUAL
===================================================== */

function atualizarResumoAtual() {

    const registrosHoje = ordenarRegistros(
        obterRegistrosHoje()
    );

    const ultimoRegistro = registrosHoje[0] || null;

    const estadoTexto = document.getElementById(
        "estadoAtualTexto"
    );

    const estadoIcone = document.getElementById(
        "estadoAtualIcone"
    );

    const ultimoRegistroTexto = document.getElementById(
        "ultimoRegistroFuncionario"
    );

    if (!ultimoRegistro) {

        if (estadoTexto) {

            estadoTexto.textContent = "Sem registro";

        }

        if (estadoIcone) {

            estadoIcone.className =
                "employee-status-icon sem-registro";

            estadoIcone.innerHTML =
                '<i class="fa-regular fa-clock"></i>';

        }

        if (ultimoRegistroTexto) {

            ultimoRegistroTexto.textContent =
                "Nenhum registro realizado hoje.";

        }

        return;

    }

    const estado = normalizarTexto(
        ultimoRegistro.estado
    );

    if (estadoTexto) {

        estadoTexto.textContent =
            ultimoRegistro.estado || "Sem registro";

    }

    if (estadoIcone) {

        estadoIcone.className =
            `employee-status-icon ${obterClasseEstado(estado)}`;

        estadoIcone.innerHTML =
            obterIconeEstado(estado);

    }

    if (ultimoRegistroTexto) {

        ultimoRegistroTexto.textContent =
            `${ultimoRegistro.momento} registrado às ` +
            `${ultimoRegistro.horario || "--:--"}.`;

    }

}

function obterClasseEstado(estado) {

    const estadoNormalizado = normalizarTexto(
        estado
    );

    if (estadoNormalizado === "disposto") {
        return "disposto";
    }

    if (estadoNormalizado === "neutro") {
        return "neutro";
    }

    if (
        estadoNormalizado === "sobrecarregado"
    ) {
        return "sobrecarregado";
    }

    return "sem-registro";

}

function obterIconeEstado(estado) {

    if (estado === "disposto") {

        return '<i class="fa-solid fa-face-smile"></i>';

    }

    if (estado === "neutro") {

        return '<i class="fa-solid fa-face-meh"></i>';

    }

    if (estado === "sobrecarregado") {

        return '<i class="fa-solid fa-face-tired"></i>';

    }

    return '<i class="fa-regular fa-clock"></i>';

}

/* =====================================================
   PROGRESSO DA JORNADA
===================================================== */

function atualizarJornada() {

    const registrosHoje = obterRegistrosHoje();

    const proximoMomento = obterProximoMomento();

    let totalConcluido = 0;

    MOMENTOS_JORNADA.forEach(momento => {

        const etapa = document.getElementById(
            momento.etapaId
        );

        const horario = document.getElementById(
            momento.horarioId
        );

        const registro = obterRegistroDoMomento(
            registrosHoje,
            momento.nome
        );

        if (!etapa || !horario) {
            return;
        }

        etapa.classList.remove(
            "concluida",
            "atual"
        );

        if (registro) {

            totalConcluido++;

            etapa.classList.add("concluida");

            horario.textContent =
                registro.horario || "Registrado";

        } else {

            horario.textContent = "Pendente";

            if (
                proximoMomento &&
                proximoMomento.nome === momento.nome
            ) {

                etapa.classList.add("atual");

            }

        }

    });

    const porcentagem = totalConcluido * 25;

    atualizarTexto(
        "porcentagemJornada",
        `${porcentagem}%`
    );

    const barraProgresso = document.getElementById(
        "barraProgressoJornada"
    );

    if (barraProgresso) {

        barraProgresso.style.width =
            `${porcentagem}%`;

    }

    atualizarLinhasJornada(totalConcluido);

    atualizarProximaEtapa(proximoMomento);

}

function atualizarLinhasJornada(totalConcluido) {

    const linhas = document.querySelectorAll(
        ".journey-line"
    );

    linhas.forEach((linha, indice) => {

        linha.classList.toggle(
            "concluida",
            totalConcluido > indice
        );

    });

}

function atualizarProximaEtapa(proximoMomento) {

    const proximaEtapaTexto = document.getElementById(
        "proximaEtapaTexto"
    );

    const momentoPonto = document.getElementById(
        "momentoPonto"
    );

    const btnBaterPonto = document.getElementById(
        "btnBaterPonto"
    );

    if (!proximoMomento) {

        if (proximaEtapaTexto) {

            proximaEtapaTexto.textContent =
                "Jornada concluída";

        }

        if (momentoPonto) {

            momentoPonto.textContent =
                "Jornada concluída";

        }

        if (btnBaterPonto) {

            btnBaterPonto.disabled = true;

            btnBaterPonto.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                Jornada concluída
            `;

        }

        return;

    }

    if (proximaEtapaTexto) {

        proximaEtapaTexto.textContent =
            proximoMomento.nome;

    }

    if (momentoPonto) {

        momentoPonto.textContent =
            proximoMomento.nome;

    }

    if (btnBaterPonto) {

        btnBaterPonto.disabled = false;

        btnBaterPonto.innerHTML = `
            <i class="fa-solid fa-fingerprint"></i>
            Bater ponto
        `;

    }

}

/* =====================================================
   MODAL DE PONTO
===================================================== */

function abrirModalPonto() {

    const proximoMomento = obterProximoMomento();

    if (!proximoMomento) {

        mostrarMensagem(
            "A jornada de hoje já foi concluída.",
            "sucesso"
        );

        return;

    }

    const modal = document.getElementById(
        "modalPonto"
    );

    const form = document.getElementById(
        "formPonto"
    );

    const momentoPonto = document.getElementById(
        "momentoPonto"
    );

    if (!modal || !form) {
        return;
    }

    form.reset();

    atualizarContadorObservacao();

    if (momentoPonto) {

        momentoPonto.textContent =
            proximoMomento.nome;

    }

    modal.classList.add("ativo");

    document.body.classList.add(
        "modal-aberto"
    );

}

function fecharModalPonto() {

    const modal = document.getElementById(
        "modalPonto"
    );

    if (!modal) {
        return;
    }

    modal.classList.remove("ativo");

    document.body.classList.remove(
        "modal-aberto"
    );

}

/* =====================================================
   SALVAR REGISTRO
===================================================== */

function salvarRegistroPonto(event) {

    event.preventDefault();

    if (registroEmAndamento) {
        return;
    }

    const botaoConfirmar = document.getElementById(
        "btnConfirmarPonto"
    );

    try {

        registroEmAndamento = true;

        if (botaoConfirmar) {
            botaoConfirmar.disabled = true;
            botaoConfirmar.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Salvando...
            `;
        }

        recarregarDados();

        if (!empresaAtual || !funcionarioAtual) {
            throw new Error(
                "Não foi possível localizar os dados da sua conta."
            );
        }

        const proximoMomento = obterProximoMomento();

        if (!proximoMomento) {
            fecharModalPonto();
            mostrarMensagem(
                "A jornada de hoje já foi concluída.",
                "erro"
            );
            return;
        }

        const estadoSelecionado = document.querySelector(
            'input[name="estadoPonto"]:checked'
        );

        if (!estadoSelecionado) {
            mostrarMensagem(
                "Selecione seu estado atual.",
                "erro"
            );
            return;
        }

        const observacao = document.getElementById(
            "observacaoPonto"
        )?.value.trim() || "";

        const agora = new Date();

        const registro = {
            id: gerarIdRegistro(),
            data: formatarDataChave(agora),
            horario: formatarHorario(agora),
            dataHora: agora.toISOString(),
            momento: proximoMomento.nome,
            estado: estadoSelecionado.value,
            observacao
        };

        const registroSalvo = registrarPonto(
            empresaAtual.nome,
            funcionarioAtual.usuario,
            registro
        );

        if (!registroSalvo) {
            throw new Error(
                "Não foi possível salvar o registro. Atualize a página e tente novamente."
            );
        }

        fecharModalPonto();
        atualizarTela();

        mostrarMensagem(
            `${proximoMomento.nome} registrado com sucesso.`,
            "sucesso"
        );

    } catch (erro) {

        console.error("Erro ao confirmar o registro:", erro);

        mostrarMensagem(
            erro?.message || "Ocorreu um erro ao salvar o registro.",
            "erro"
        );

    } finally {

        registroEmAndamento = false;

        if (botaoConfirmar) {
            botaoConfirmar.disabled = false;
            botaoConfirmar.innerHTML = `
                <i class="fa-solid fa-check"></i>
                Confirmar registro
            `;
        }

    }

}

function gerarIdRegistro() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {

        return crypto.randomUUID();

    }

    return (
        `${Date.now()}-` +
        `${Math.floor(Math.random() * 100000)}`
    );

}

/* =====================================================
   CONTADOR DA OBSERVAÇÃO
===================================================== */

function atualizarContadorObservacao() {

    const observacao = document.getElementById(
        "observacaoPonto"
    );

    const contador = document.getElementById(
        "contadorObservacao"
    );

    if (!observacao || !contador) {
        return;
    }

    contador.textContent =
        `${observacao.value.length}/250`;

}

/* =====================================================
   HISTÓRICO
===================================================== */

function atualizarHistorico() {

    const registros = Array.isArray(
        funcionarioAtual.registros
    )
        ? [...funcionarioAtual.registros]
        : [];

    const filtro = document.getElementById(
        "filtroHistoricoFuncionario"
    )?.value || "7";

    const registrosFiltrados = filtrarHistorico(
        registros,
        filtro
    );

    preencherTabelaHistorico(
        ordenarRegistros(registrosFiltrados)
    );

}

function filtrarHistorico(registros, filtro) {

    if (filtro === "todos") {

        return registros;

    }

    const quantidadeDias = Number(filtro);

    if (!quantidadeDias) {

        return registros;

    }

    const dataLimite = new Date();

    dataLimite.setHours(0, 0, 0, 0);

    dataLimite.setDate(
        dataLimite.getDate() -
        (quantidadeDias - 1)
    );

    return registros.filter(registro => {

        const dataRegistro = converterDataRegistro(
            obterDataRegistro(registro)
        );

        return dataRegistro >= dataLimite;

    });

}

function preencherTabelaHistorico(registros) {

    const tabela = document.getElementById(
        "tabelaHistoricoFuncionario"
    );

    const estadoVazio = document.getElementById(
        "historicoFuncionarioVazio"
    );

    if (!tabela || !estadoVazio) {
        return;
    }

    tabela.innerHTML = "";

    if (registros.length === 0) {

        estadoVazio.style.display = "block";

        return;

    }

    estadoVazio.style.display = "none";

    registros.forEach(registro => {

        const linha = document.createElement("tr");

        linha.innerHTML = `

            <td>
                ${formatarDataBrasileira(
                    obterDataRegistro(registro)
                )}
            </td>

            <td>
                ${escaparHtml(
                    registro.horario || "—"
                )}
            </td>

            <td>
                ${escaparHtml(
                    registro.momento || "—"
                )}
            </td>

            <td>

                <span class="state-badge ${obterClasseEstado(
                    registro.estado
                )}">

                    ${escaparHtml(
                        registro.estado || "—"
                    )}

                </span>

            </td>

            <td>
                ${escaparHtml(
                    registro.observacao || "—"
                )}
            </td>

        `;

        tabela.appendChild(linha);

    });

}

/* =====================================================
   DATAS E HORÁRIOS
===================================================== */

function formatarDataChave(data) {

    const ano = data.getFullYear();

    const mes = String(
        data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}

function formatarHorario(data) {

    const horas = String(
        data.getHours()
    ).padStart(2, "0");

    const minutos = String(
        data.getMinutes()
    ).padStart(2, "0");

    return `${horas}:${minutos}`;

}

function obterDataRegistro(registro) {

    return String(
        registro?.data || ""
    ).slice(0, 10);

}

function converterDataRegistro(data) {

    const partes = String(data)
        .split("-")
        .map(Number);

    if (partes.length !== 3) {

        return new Date(0);

    }

    return new Date(
        partes[0],
        partes[1] - 1,
        partes[2]
    );

}

function obterTimestampRegistro(registro) {

    if (registro.dataHora) {

        const timestamp = new Date(
            registro.dataHora
        ).getTime();

        if (!Number.isNaN(timestamp)) {

            return timestamp;

        }

    }

    const data = obterDataRegistro(registro);

    const horario = String(
        registro.horario || "00:00"
    );

    const partesData = data
        .split("-")
        .map(Number);

    const partesHorario = horario
        .split(":")
        .map(Number);

    if (partesData.length !== 3) {
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

function ordenarRegistros(registros) {

    return [...registros].sort(
        (registroA, registroB) =>
            obterTimestampRegistro(registroB) -
            obterTimestampRegistro(registroA)
    );

}

function formatarDataBrasileira(data) {

    const partes = String(data).split("-");

    if (partes.length !== 3) {

        return data || "—";

    }

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

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

    elemento.textContent = String(texto || "");

    return elemento.innerHTML;

}

/* =====================================================
   NOTIFICAÇÕES
===================================================== */

function mostrarMensagem(texto, tipo) {

    let mensagem = document.querySelector(
        ".mensagem"
    );

    if (!mensagem) {

        mensagem = document.createElement("div");

        mensagem.className = "mensagem";

        document.body.appendChild(mensagem);

    }

    if (temporizadorMensagem) {

        clearTimeout(temporizadorMensagem);

    }

    mensagem.textContent = texto;

    mensagem.classList.remove(
        "erro",
        "sucesso",
        "mostrar"
    );

    mensagem.classList.add(tipo);

    setTimeout(() => {

        mensagem.classList.add("mostrar");

    }, 10);

    temporizadorMensagem = setTimeout(() => {

        mensagem.classList.remove("mostrar");

    }, 3000);

}