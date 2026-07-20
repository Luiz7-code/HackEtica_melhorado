/* =====================================================
   GESTÃO SAUDÁVEL
   BANCO DE DADOS LOCAL
===================================================== */

const CHAVE_EMPRESAS = "empresas";
const CHAVE_USUARIO = "usuarioLogado";
const CHAVE_EMPRESA = "empresaAtual";
const CHAVE_VERSAO_BANCO = "versaoBanco";
const VERSAO_BANCO_ATUAL = "logicomp-6-funcionarios-v1";

/* =====================================================
   DADOS PADRÃO DO PROJETO
===================================================== */

function formatarDataBanco(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function criarRegistroPadrao(diasAtras, horario, momento, estado, observacao = "") {
    const data = new Date();

    data.setHours(0, 0, 0, 0);
    data.setDate(data.getDate() - diasAtras);

    return {
        id: gerarIdBanco(),
        data: formatarDataBanco(data),
        horario,
        dataHora: `${formatarDataBanco(data)}T${horario}:00`,
        momento,
        estado,
        observacao
    };
}

function criarEmpresasPadrao() {
    const agora = new Date().toISOString();

    return [
        {
            id: gerarIdBanco(),
            nome: "Logicomp",
            cnpj: "12.345.678/0001-90",
            ramo: "Tecnologia",
            dataCadastro: agora,
            funcionarios: [
                {
                    id: gerarIdBanco(),
                    nome: "Administrador",
                    usuario: "admin",
                    senha: "123",
                    tipo: "gestor",
                    setor: "Gestão",
                    cargo: "Gestor",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [],
                    icpi: 100
                },
                {
                    id: gerarIdBanco(),
                    nome: "João Silva",
                    usuario: "joao",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "TI",
                    cargo: "Desenvolvedor",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "08:02", "Entrada", "Disposto"),
                        criarRegistroPadrao(1, "12:01", "Saída para almoço", "Neutro"),
                        criarRegistroPadrao(1, "13:03", "Volta do almoço", "Disposto"),
                        criarRegistroPadrao(1, "17:32", "Saída", "Neutro"),
                        criarRegistroPadrao(2, "08:05", "Entrada", "Disposto"),
                        criarRegistroPadrao(2, "17:29", "Saída", "Disposto")
                    ],
                    icpi: 88
                },
                {
                    id: gerarIdBanco(),
                    nome: "Maria Oliveira",
                    usuario: "maria",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "RH",
                    cargo: "Analista de RH",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "08:08", "Entrada", "Neutro"),
                        criarRegistroPadrao(1, "12:05", "Saída para almoço", "Neutro"),
                        criarRegistroPadrao(1, "13:01", "Volta do almoço", "Disposto"),
                        criarRegistroPadrao(1, "17:38", "Saída", "Neutro"),
                        criarRegistroPadrao(3, "08:00", "Entrada", "Disposto"),
                        criarRegistroPadrao(3, "17:30", "Saída", "Disposto")
                    ],
                    icpi: 72
                },
                {
                    id: gerarIdBanco(),
                    nome: "Pedro Santos",
                    usuario: "pedro",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "Financeiro",
                    cargo: "Analista Financeiro",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "07:56", "Entrada", "Sobrecarregado"),
                        criarRegistroPadrao(1, "12:00", "Saída para almoço", "Sobrecarregado"),
                        criarRegistroPadrao(1, "13:00", "Volta do almoço", "Neutro"),
                        criarRegistroPadrao(1, "17:45", "Saída", "Sobrecarregado"),
                        criarRegistroPadrao(2, "08:01", "Entrada", "Neutro"),
                        criarRegistroPadrao(2, "17:41", "Saída", "Neutro")
                    ],
                    icpi: 45
                },
                {
                    id: gerarIdBanco(),
                    nome: "Ana Costa",
                    usuario: "ana",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "Marketing",
                    cargo: "Analista de Marketing",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "08:12", "Entrada", "Disposto"),
                        criarRegistroPadrao(1, "12:10", "Saída para almoço", "Disposto"),
                        criarRegistroPadrao(1, "13:08", "Volta do almoço", "Disposto"),
                        criarRegistroPadrao(1, "17:25", "Saída", "Disposto"),
                        criarRegistroPadrao(4, "08:09", "Entrada", "Neutro"),
                        criarRegistroPadrao(4, "17:31", "Saída", "Disposto")
                    ],
                    icpi: 100
                },
                {
                    id: gerarIdBanco(),
                    nome: "Lucas Almeida",
                    usuario: "lucas",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "Produção",
                    cargo: "Supervisor de Produção",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "07:48", "Entrada", "Neutro"),
                        criarRegistroPadrao(1, "11:58", "Saída para almoço", "Neutro"),
                        criarRegistroPadrao(1, "12:57", "Volta do almoço", "Neutro"),
                        criarRegistroPadrao(1, "17:20", "Saída", "Neutro"),
                        criarRegistroPadrao(2, "07:50", "Entrada", "Sobrecarregado"),
                        criarRegistroPadrao(2, "17:22", "Saída", "Neutro")
                    ],
                    icpi: 60
                },
                {
                    id: gerarIdBanco(),
                    nome: "Juliana Ferreira",
                    usuario: "juliana",
                    senha: "123",
                    tipo: "funcionario",
                    setor: "Comercial",
                    cargo: "Assistente Comercial",
                    ativo: true,
                    dataCadastro: agora,
                    registros: [
                        criarRegistroPadrao(1, "08:04", "Entrada", "Disposto"),
                        criarRegistroPadrao(1, "12:03", "Saída para almoço", "Neutro"),
                        criarRegistroPadrao(1, "13:05", "Volta do almoço", "Disposto"),
                        criarRegistroPadrao(1, "17:35", "Saída", "Disposto"),
                        criarRegistroPadrao(3, "08:02", "Entrada", "Disposto"),
                        criarRegistroPadrao(3, "17:33", "Saída", "Neutro")
                    ],
                    icpi: 86
                }
            ]
        }
    ];
}

function inicializarBancoPadrao() {
    const versaoSalva = localStorage.getItem(CHAVE_VERSAO_BANCO);
    const empresasExistentes = carregarEmpresas();

    if (
        versaoSalva === VERSAO_BANCO_ATUAL &&
        empresasExistentes.length > 0
    ) {
        return empresasExistentes;
    }

    const empresasPadrao = criarEmpresasPadrao();

    salvarEmpresas(empresasPadrao);
    localStorage.setItem(CHAVE_VERSAO_BANCO, VERSAO_BANCO_ATUAL);
    encerrarSessao();

    return empresasPadrao;
}

/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function normalizarValorBanco(valor) {
    return String(valor || "")
        .trim()
        .toLowerCase();
}

function gerarIdBanco() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

/* =====================================================
   EMPRESAS
===================================================== */

function carregarEmpresas() {
    const dados = localStorage.getItem(CHAVE_EMPRESAS);

    if (!dados) {
        return [];
    }

    try {
        const empresas = JSON.parse(dados);

        return Array.isArray(empresas)
            ? empresas
            : [];
    } catch (erro) {
        console.error("Erro ao carregar as empresas:", erro);
        return [];
    }
}

function salvarEmpresas(empresas) {
    try {
        localStorage.setItem(
            CHAVE_EMPRESAS,
            JSON.stringify(Array.isArray(empresas) ? empresas : [])
        );

        return true;
    } catch (erro) {
        console.error("Erro ao salvar as empresas:", erro);
        return false;
    }
}

function buscarEmpresa(nomeEmpresa) {
    const nomeNormalizado = normalizarValorBanco(nomeEmpresa);

    if (!nomeNormalizado) {
        return null;
    }

    return carregarEmpresas().find(empresa =>
        normalizarValorBanco(empresa?.nome) === nomeNormalizado
    ) || null;
}

function atualizarEmpresa(empresaAtualizada) {
    if (!empresaAtualizada) {
        return false;
    }

    const empresas = carregarEmpresas();

    const indice = empresas.findIndex(empresa =>
        String(empresa.id) === String(empresaAtualizada.id)
    );

    if (indice === -1) {
        return false;
    }

    empresas[indice] = empresaAtualizada;

    return salvarEmpresas(empresas);
}

/* =====================================================
   SESSÃO
===================================================== */

function salvarSessao(usuario, empresa) {
    localStorage.setItem(CHAVE_USUARIO, String(usuario || ""));
    localStorage.setItem(CHAVE_EMPRESA, String(empresa || ""));
}

function obterUsuarioLogado() {
    return localStorage.getItem(CHAVE_USUARIO);
}

function obterEmpresaAtual() {
    return localStorage.getItem(CHAVE_EMPRESA);
}

function encerrarSessao() {
    localStorage.removeItem(CHAVE_USUARIO);
    localStorage.removeItem(CHAVE_EMPRESA);
}

/* =====================================================
   CADASTRO DE EMPRESA
===================================================== */

function cadastrarEmpresa(dadosEmpresa) {
    const empresas = carregarEmpresas();

    const nome = String(dadosEmpresa?.nome || "").trim();
    const usuarioGestor = String(dadosEmpresa?.usuario || "").trim();

    if (!nome || !usuarioGestor || !dadosEmpresa?.senha) {
        return {
            sucesso: false,
            mensagem: "Preencha os dados obrigatórios da empresa."
        };
    }

    const empresaExiste = empresas.some(empresa =>
        normalizarValorBanco(empresa.nome) === normalizarValorBanco(nome)
    );

    if (empresaExiste) {
        return {
            sucesso: false,
            mensagem: "Já existe uma empresa com esse nome."
        };
    }

    const novaEmpresa = {
        id: gerarIdBanco(),
        nome,
        cnpj: String(dadosEmpresa.cnpj || "").trim(),
        ramo: String(dadosEmpresa.ramo || "").trim(),
        dataCadastro: new Date().toISOString(),
        funcionarios: [
            {
                id: gerarIdBanco(),
                nome: String(dadosEmpresa.nomeGestor || "Gestor").trim(),
                usuario: usuarioGestor,
                senha: dadosEmpresa.senha,
                tipo: "gestor",
                setor: "Gestão",
                cargo: "Gestor",
                ativo: true,
                dataCadastro: new Date().toISOString(),
                registros: [],
                icpi: 100
            }
        ]
    };

    empresas.push(novaEmpresa);

    if (!salvarEmpresas(empresas)) {
        return {
            sucesso: false,
            mensagem: "Não foi possível salvar a empresa."
        };
    }

    return {
        sucesso: true,
        mensagem: "Empresa cadastrada com sucesso.",
        empresa: novaEmpresa
    };
}

/* =====================================================
   FUNCIONÁRIOS
===================================================== */

function buscarFuncionario(nomeEmpresa, usuario) {
    const empresa = buscarEmpresa(nomeEmpresa);

    if (!empresa || !Array.isArray(empresa.funcionarios)) {
        return null;
    }

    const usuarioNormalizado = normalizarValorBanco(usuario);

    return empresa.funcionarios.find(funcionario =>
        normalizarValorBanco(funcionario?.usuario) === usuarioNormalizado
    ) || null;
}

function buscarFuncionarioPorId(nomeEmpresa, funcionarioId) {
    const empresa = buscarEmpresa(nomeEmpresa);

    if (!empresa || !Array.isArray(empresa.funcionarios)) {
        return null;
    }

    return empresa.funcionarios.find(funcionario =>
        String(funcionario.id) === String(funcionarioId)
    ) || null;
}

function cadastrarFuncionario(nomeEmpresa, dadosFuncionario) {
    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        normalizarValorBanco(empresa.nome) ===
        normalizarValorBanco(nomeEmpresa)
    );

    if (indiceEmpresa === -1) {
        return {
            sucesso: false,
            mensagem: "Empresa não encontrada."
        };
    }

    const empresa = empresas[indiceEmpresa];

    if (!Array.isArray(empresa.funcionarios)) {
        empresa.funcionarios = [];
    }

    const usuario = String(dadosFuncionario?.usuario || "").trim();

    const usuarioExiste = empresa.funcionarios.some(funcionario =>
        normalizarValorBanco(funcionario.usuario) ===
        normalizarValorBanco(usuario)
    );

    if (usuarioExiste) {
        return {
            sucesso: false,
            mensagem: "Esse nome de usuário já está sendo utilizado."
        };
    }

    const novoFuncionario = {
        id: gerarIdBanco(),
        nome: String(dadosFuncionario?.nome || "").trim(),
        usuario,
        senha: dadosFuncionario?.senha || "",
        tipo: "funcionario",
        setor: String(dadosFuncionario?.setor || "").trim(),
        cargo: String(dadosFuncionario?.cargo || "").trim(),
        ativo: true,
        dataCadastro: new Date().toISOString(),
        registros: [],
        icpi: 100
    };

    empresa.funcionarios.push(novoFuncionario);

    if (!salvarEmpresas(empresas)) {
        return {
            sucesso: false,
            mensagem: "Não foi possível salvar o funcionário."
        };
    }

    return {
        sucesso: true,
        mensagem: "Funcionário cadastrado com sucesso.",
        funcionario: novoFuncionario
    };
}

function editarFuncionario(nomeEmpresa, funcionarioId, novosDados) {
    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        normalizarValorBanco(empresa.nome) ===
        normalizarValorBanco(nomeEmpresa)
    );

    if (indiceEmpresa === -1) {
        return {
            sucesso: false,
            mensagem: "Empresa não encontrada."
        };
    }

    const empresa = empresas[indiceEmpresa];

    if (!Array.isArray(empresa.funcionarios)) {
        empresa.funcionarios = [];
    }

    const funcionario = empresa.funcionarios.find(item =>
        String(item.id) === String(funcionarioId)
    );

    if (!funcionario) {
        return {
            sucesso: false,
            mensagem: "Funcionário não encontrado."
        };
    }

    if (funcionario.tipo === "gestor") {
        return {
            sucesso: false,
            mensagem: "A conta do gestor não pode ser alterada por aqui."
        };
    }

    const usuario = String(novosDados?.usuario || "").trim();

    const usuarioExiste = empresa.funcionarios.some(item =>
        String(item.id) !== String(funcionarioId) &&
        normalizarValorBanco(item.usuario) === normalizarValorBanco(usuario)
    );

    if (usuarioExiste) {
        return {
            sucesso: false,
            mensagem: "Esse nome de usuário já está sendo utilizado."
        };
    }

    funcionario.nome = String(novosDados?.nome || "").trim();
    funcionario.usuario = usuario;
    funcionario.setor = String(novosDados?.setor || "").trim();
    funcionario.cargo = String(novosDados?.cargo || "").trim();

    if (novosDados?.senha) {
        funcionario.senha = novosDados.senha;
    }

    if (!Array.isArray(funcionario.registros)) {
        funcionario.registros = [];
    }

    if (!salvarEmpresas(empresas)) {
        return {
            sucesso: false,
            mensagem: "Não foi possível atualizar o funcionário."
        };
    }

    return {
        sucesso: true,
        mensagem: "Funcionário atualizado com sucesso.",
        funcionario
    };
}

function excluirFuncionario(nomeEmpresa, funcionarioId) {
    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        normalizarValorBanco(empresa.nome) ===
        normalizarValorBanco(nomeEmpresa)
    );

    if (indiceEmpresa === -1) {
        return {
            sucesso: false,
            mensagem: "Empresa não encontrada."
        };
    }

    const empresa = empresas[indiceEmpresa];

    if (!Array.isArray(empresa.funcionarios)) {
        empresa.funcionarios = [];
    }

    const indiceFuncionario = empresa.funcionarios.findIndex(funcionario =>
        String(funcionario.id) === String(funcionarioId)
    );

    if (indiceFuncionario === -1) {
        return {
            sucesso: false,
            mensagem: "Funcionário não encontrado."
        };
    }

    const funcionario = empresa.funcionarios[indiceFuncionario];

    if (funcionario.tipo === "gestor") {
        return {
            sucesso: false,
            mensagem: "A conta do gestor não pode ser excluída."
        };
    }

    empresa.funcionarios.splice(indiceFuncionario, 1);

    if (!salvarEmpresas(empresas)) {
        return {
            sucesso: false,
            mensagem: "Não foi possível excluir o funcionário."
        };
    }

    return {
        sucesso: true,
        mensagem: "Funcionário excluído com sucesso."
    };
}

/* =====================================================
   REGISTRO DE PONTO
===================================================== */

function registrarPonto(nomeEmpresa, usuario, registro) {
    try {
        const empresa = buscarEmpresa(nomeEmpresa);

        if (!empresa || !Array.isArray(empresa.funcionarios)) {
            return false;
        }

        const usuarioNormalizado = normalizarValorBanco(usuario);

        const funcionario = empresa.funcionarios.find(item =>
            normalizarValorBanco(item?.usuario) === usuarioNormalizado
        );

        if (!funcionario || funcionario.ativo === false) {
            return false;
        }

        if (!Array.isArray(funcionario.registros)) {
            funcionario.registros = [];
        }

        const dataRegistro = String(registro?.data || "").slice(0, 10);
        const momentoRegistro = normalizarValorBanco(registro?.momento);

        if (!dataRegistro || !momentoRegistro || !registro?.estado) {
            return false;
        }

        const registroDuplicado = funcionario.registros.some(item =>
            String(item?.data || "").slice(0, 10) === dataRegistro &&
            normalizarValorBanco(item?.momento) === momentoRegistro
        );

        if (registroDuplicado) {
            return false;
        }

        funcionario.registros.push(registro);

        return atualizarEmpresa(empresa);
    } catch (erro) {
        console.error("Erro ao registrar o ponto:", erro);
        return false;
    }
}


/* Cria as empresas de demonstração somente quando o armazenamento estiver vazio. */
inicializarBancoPadrao();
