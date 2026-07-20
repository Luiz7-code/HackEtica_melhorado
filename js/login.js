/* =====================================================
   GESTÃO SAUDÁVEL
   LOGIN
===================================================== */

const CHAVE_EMPRESA_LEMBRADA = "gestaoSaudavel_lembrarEmpresa";

const formLogin = document.getElementById("formLogin");
const campoEmpresa = document.getElementById("empresa");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const lembrarEmpresa = document.getElementById("lembrarEmpresa");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");

iniciarLogin();

function iniciarLogin() {
    carregarEmpresaLembrada();

    formLogin?.addEventListener("submit", realizarLogin);
    btnMostrarSenha?.addEventListener("click", alternarVisibilidadeSenha);
}

function carregarEmpresaLembrada() {
    const empresaLembrada = localStorage.getItem(CHAVE_EMPRESA_LEMBRADA);

    if (!empresaLembrada || !campoEmpresa) {
        return;
    }

    campoEmpresa.value = empresaLembrada;

    if (lembrarEmpresa) {
        lembrarEmpresa.checked = true;
    }
}

function realizarLogin(event) {
    event.preventDefault();

    const empresaNome = campoEmpresa?.value.trim() || "";
    const usuarioNome = campoUsuario?.value.trim() || "";
    const senha = campoSenha?.value || "";

    if (!empresaNome || !usuarioNome || !senha) {
        mostrarMensagem("Preencha empresa, usuário e senha.", "erro");
        return;
    }

    const empresa = buscarEmpresa(empresaNome);

    if (!empresa) {
        mostrarMensagem("Empresa não encontrada.", "erro");
        return;
    }

    autenticarUsuario(empresa, usuarioNome, senha);
}

function autenticarUsuario(empresa, usuarioNome, senha) {
    const funcionarios = Array.isArray(empresa.funcionarios)
        ? empresa.funcionarios
        : [];

    const usuarioNormalizado = usuarioNome.toLowerCase();

    const usuario = funcionarios.find(item =>
        String(item.usuario || "").trim().toLowerCase() === usuarioNormalizado &&
        item.senha === senha
    );

    if (!usuario) {
        mostrarMensagem("Usuário ou senha inválidos.", "erro");
        return;
    }

    if (usuario.ativo === false) {
        mostrarMensagem("Esta conta está desativada.", "erro");
        return;
    }

    salvarSessao(usuario.usuario, empresa.nome);
    salvarPreferenciaEmpresa(empresa.nome);

    if (usuario.tipo === "gestor") {
        window.location.href = "gestor.html";
        return;
    }

    window.location.href = "funcionario.html";
}

function salvarPreferenciaEmpresa(nomeEmpresa) {
    if (lembrarEmpresa?.checked) {
        localStorage.setItem(CHAVE_EMPRESA_LEMBRADA, nomeEmpresa);
        return;
    }

    localStorage.removeItem(CHAVE_EMPRESA_LEMBRADA);
}

function alternarVisibilidadeSenha() {
    if (!campoSenha || !btnMostrarSenha) {
        return;
    }

    const exibindo = campoSenha.type === "text";

    campoSenha.type = exibindo
        ? "password"
        : "text";

    btnMostrarSenha.innerHTML = exibindo
        ? '<i class="fa-regular fa-eye"></i>'
        : '<i class="fa-regular fa-eye-slash"></i>';

    btnMostrarSenha.setAttribute(
        "aria-label",
        exibindo ? "Mostrar senha" : "Ocultar senha"
    );
}

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
