/* =====================================================
   GESTÃO SAUDÁVEL
   LOGIN
===================================================== */

const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", realizarLogin);

}

/* =====================================================
   LOGIN
===================================================== */

function realizarLogin(event) {

    event.preventDefault();

    const empresaNome = document.getElementById("empresa").value.trim();

    const usuarioNome = document.getElementById("usuario").value.trim();

    const senha = document.getElementById("senha").value;

    const empresas = carregarEmpresas();

    const empresa = empresas.find(e =>
        e.nome.toLowerCase() === empresaNome.toLowerCase()
    );

    if (!empresa) {

        mostrarMensagem("Empresa não encontrada.", "erro");

        return;

    }

    autenticarUsuario(empresa, usuarioNome, senha);

}
/* =====================================================
   AUTENTICAÇÃO
===================================================== */

function autenticarUsuario(empresa, usuarioNome, senha) {

    const usuario = empresa.funcionarios.find(u =>
        u.usuario === usuarioNome &&
        u.senha === senha
    );

    if (!usuario) {

        mostrarMensagem("Usuário ou senha inválidos.", "erro");

        return;

    }

    localStorage.setItem("empresaAtual", empresa.nome);

    localStorage.setItem("usuarioLogado", usuario.usuario);

    if (usuario.tipo === "gestor") {

        window.location.href = "gestor.html";

    } else {

        window.location.href = "funcionario.html";

    }

}
/* =====================================================
   MENSAGENS
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