/* =====================================================
   GESTÃO SAUDÁVEL
   BANCO DE DADOS LOCAL
===================================================== */

const CHAVE_EMPRESAS = "empresas";

const CHAVE_USUARIO = "usuarioLogado";

const CHAVE_EMPRESA = "empresaAtual";

/* =====================================================
   EMPRESAS
===================================================== */

function carregarEmpresas(){

    const dados = localStorage.getItem(CHAVE_EMPRESAS);

    if(!dados){

        return [];

    }

    return JSON.parse(dados);

}

function salvarEmpresas(empresas){

    localStorage.setItem(

        CHAVE_EMPRESAS,

        JSON.stringify(empresas)

    );

}
/* =====================================================
   USUÁRIO LOGADO
===================================================== */

function salvarSessao(usuario,empresa){

    localStorage.setItem(

        CHAVE_USUARIO,

        usuario

    );

    localStorage.setItem(

        CHAVE_EMPRESA,

        empresa

    );

}

function obterUsuarioLogado(){

    return localStorage.getItem(

        CHAVE_USUARIO

    );

}

function obterEmpresaAtual(){

    return localStorage.getItem(

        CHAVE_EMPRESA

    );

}

function encerrarSessao(){

    localStorage.removeItem(

        CHAVE_USUARIO

    );

    localStorage.removeItem(

        CHAVE_EMPRESA

    );

}
/* =====================================================
   CADASTRO DE EMPRESA
===================================================== */

function cadastrarEmpresa(dadosEmpresa){

    const empresas = carregarEmpresas();

    const empresaExiste = empresas.some(empresa =>
        empresa.nome.toLowerCase() === dadosEmpresa.nome.toLowerCase()
    );

    if(empresaExiste){

        return{

            sucesso:false,

            mensagem:"Já existe uma empresa com esse nome."

        };

    }

    const novaEmpresa={

        id:Date.now(),

        nome:dadosEmpresa.nome,

        cnpj:dadosEmpresa.cnpj,

        ramo:dadosEmpresa.ramo,

        dataCadastro:new Date().toISOString(),

        funcionarios:[

            {

                id:1,

                nome:dadosEmpresa.nomeGestor,

                usuario:dadosEmpresa.usuario,

                senha:dadosEmpresa.senha,

                tipo:"gestor",

                setor:"Gestão",

                cargo:"Gestor",

                registros:[],

                icpi:100

            }

        ]

    };

    empresas.push(novaEmpresa);

    salvarEmpresas(empresas);

    return{

        sucesso:true,

        mensagem:"Empresa cadastrada com sucesso."

    };

}
/* =====================================================
   FUNCIONÁRIOS
===================================================== */

function buscarEmpresa(nomeEmpresa){

    const empresas = carregarEmpresas();

    return empresas.find(empresa =>
        empresa.nome.toLowerCase() === nomeEmpresa.toLowerCase()
    );

}

function buscarFuncionario(nomeEmpresa,usuario){

    const empresa = buscarEmpresa(nomeEmpresa);

    if(!empresa){

        return null;

    }

    return empresa.funcionarios.find(funcionario =>
        funcionario.usuario === usuario
    );

}

function atualizarEmpresa(empresaAtualizada){

    const empresas = carregarEmpresas();

    const indice = empresas.findIndex(empresa =>
        empresa.id === empresaAtualizada.id
    );

    if(indice === -1){

        return false;

    }

    empresas[indice] = empresaAtualizada;

    salvarEmpresas(empresas);

    return true;

}
/* =====================================================
   REGISTRO DE PONTO
===================================================== */

function registrarPonto(nomeEmpresa,usuario,registro){

    const empresa = buscarEmpresa(nomeEmpresa);

    if(!empresa){

        return false;

    }

    const funcionario = empresa.funcionarios.find(f =>
        f.usuario === usuario
    );

    if(!funcionario){

        return false;

    }

    funcionario.registros.push(registro);

    atualizarEmpresa(empresa);

    return true;

}
/* =====================================================
   GESTÃO DE FUNCIONÁRIOS
===================================================== */

function gerarIdFuncionario() {

    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

}

/* =====================================================
   CADASTRAR FUNCIONÁRIO
===================================================== */

function cadastrarFuncionario(nomeEmpresa, dadosFuncionario) {

    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        empresa.nome.toLowerCase() === nomeEmpresa.toLowerCase()
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

    const usuario = dadosFuncionario.usuario.trim();

    const usuarioExiste = empresa.funcionarios.some(funcionario =>
        funcionario.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (usuarioExiste) {

        return {
            sucesso: false,
            mensagem: "Esse nome de usuário já está sendo utilizado."
        };

    }

    const novoFuncionario = {

        id: gerarIdFuncionario(),

        nome: dadosFuncionario.nome.trim(),

        usuario,

        senha: dadosFuncionario.senha,

        tipo: "funcionario",

        setor: dadosFuncionario.setor.trim(),

        cargo: dadosFuncionario.cargo.trim(),

        ativo: true,

        dataCadastro: new Date().toISOString(),

        registros: [],

        icpi: 100

    };

    empresa.funcionarios.push(novoFuncionario);

    salvarEmpresas(empresas);

    return {

        sucesso: true,

        mensagem: "Funcionário cadastrado com sucesso.",

        funcionario: novoFuncionario

    };

}

/* =====================================================
   EDITAR FUNCIONÁRIO
===================================================== */

function editarFuncionario(
    nomeEmpresa,
    funcionarioId,
    novosDados
) {

    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        empresa.nome.toLowerCase() === nomeEmpresa.toLowerCase()
    );

    if (indiceEmpresa === -1) {

        return {
            sucesso: false,
            mensagem: "Empresa não encontrada."
        };

    }

    const empresa = empresas[indiceEmpresa];

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

    const usuario = novosDados.usuario.trim();

    const usuarioExiste = empresa.funcionarios.some(item =>
        String(item.id) !== String(funcionarioId) &&
        item.usuario.toLowerCase() === usuario.toLowerCase()
    );

    if (usuarioExiste) {

        return {
            sucesso: false,
            mensagem: "Esse nome de usuário já está sendo utilizado."
        };

    }

    funcionario.nome = novosDados.nome.trim();

    funcionario.usuario = usuario;

    funcionario.setor = novosDados.setor.trim();

    funcionario.cargo = novosDados.cargo.trim();

    if (novosDados.senha) {
        funcionario.senha = novosDados.senha;
    }

    salvarEmpresas(empresas);

    return {

        sucesso: true,

        mensagem: "Funcionário atualizado com sucesso.",

        funcionario

    };

}

/* =====================================================
   EXCLUIR FUNCIONÁRIO
===================================================== */

function excluirFuncionario(
    nomeEmpresa,
    funcionarioId
) {

    const empresas = carregarEmpresas();

    const indiceEmpresa = empresas.findIndex(empresa =>
        empresa.nome.toLowerCase() === nomeEmpresa.toLowerCase()
    );

    if (indiceEmpresa === -1) {

        return {
            sucesso: false,
            mensagem: "Empresa não encontrada."
        };

    }

    const empresa = empresas[indiceEmpresa];

    const indiceFuncionario = empresa.funcionarios.findIndex(
        funcionario =>
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

    salvarEmpresas(empresas);

    return {

        sucesso: true,

        mensagem: "Funcionário excluído com sucesso."

    };

}

/* =====================================================
   BUSCAR FUNCIONÁRIO PELO ID
===================================================== */

function buscarFuncionarioPorId(
    nomeEmpresa,
    funcionarioId
) {

    const empresa = buscarEmpresa(nomeEmpresa);

    if (
        !empresa ||
        !Array.isArray(empresa.funcionarios)
    ) {
        return null;
    }

    return empresa.funcionarios.find(funcionario =>
        String(funcionario.id) === String(funcionarioId)
    ) || null;

}