/* =====================================================
   GESTÃO SAUDÁVEL
   CADASTRO DE EMPRESA
===================================================== */

const formCadastro = document.getElementById("formCadastro");
const campoCnpj = document.getElementById("cnpj");

if (campoCnpj) {
    campoCnpj.addEventListener("input", aplicarMascaraCnpj);
}

if (formCadastro) {
    formCadastro.addEventListener("submit", realizarCadastro);
}

/* =====================================================
   CADASTRO
===================================================== */

function realizarCadastro(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeEmpresa").value.trim();
    const cnpj = document.getElementById("cnpj").value.trim();
    const ramo = document.getElementById("ramo").value;
    const nomeGestor = document.getElementById("nomeGestor").value.trim();
    const usuario = document.getElementById("usuarioGestor").value.trim();
    const senha = document.getElementById("senhaGestor").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (
        !nome ||
        !cnpj ||
        !ramo ||
        !nomeGestor ||
        !usuario ||
        !senha ||
        !confirmarSenha
    ) {
        mostrarMensagem("Preencha todos os campos.", "erro");
        return;
    }

    if (limparCnpj(cnpj).length !== 14) {
        mostrarMensagem("Digite um CNPJ válido com 14 números.", "erro");
        return;
    }

    if (senha.length < 4) {
        mostrarMensagem("A senha precisa ter pelo menos 4 caracteres.", "erro");
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não coincidem.", "erro");
        return;
    }

    const empresas = carregarEmpresas();

    const cnpjJaExiste = empresas.some(empresa =>
        limparCnpj(empresa.cnpj || "") === limparCnpj(cnpj)
    );

    if (cnpjJaExiste) {
        mostrarMensagem("Esse CNPJ já está cadastrado.", "erro");
        return;
    }

    const resultado = cadastrarEmpresa({
        nome,
        cnpj,
        ramo,
        nomeGestor,
        usuario,
        senha
    });

    if (!resultado.sucesso) {
        mostrarMensagem(resultado.mensagem, "erro");
        return;
    }

    mostrarMensagem(resultado.mensagem, "sucesso");

    formCadastro.reset();

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

/* =====================================================
   MÁSCARA DO CNPJ
===================================================== */

function aplicarMascaraCnpj(event) {
    let valor = event.target.value.replace(/\D/g, "");

    valor = valor.slice(0, 14);

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    event.target.value = valor;
}

function limparCnpj(cnpj) {
    return cnpj.replace(/\D/g, "");
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

    setTimeout(() => {
        mensagem.classList.add("mostrar");
    }, 10);

    setTimeout(() => {
        mensagem.classList.remove("mostrar");
    }, 3000);
}