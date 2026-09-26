function abrirModal() {
    document.getElementById("modal-bo").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal-bo").style.display = "none";
}

function salvarBO(event) {
    event.preventDefault();

    const oficial = document.getElementById("oficial").value;
    const suspeito = document.getElementById("suspeito").value;
    const infracao = document.getElementById("infracao").value;
    const dataHora = new Date().toLocaleString('pt-BR');
    const id = '#BO-' + Math.floor(1000 + Math.random() * 9000);

    const tabela = document.getElementById("lista-bo");
    const novaLinha = `
        <tr>
            <td>${id}</td>
            <td>${oficial}</td>
            <td>${suspeito}</td>
            <td>${infracao}</td>
            <td>${dataHora}</td>
            <td><span class="badge green">Em Investigação</span></td>
        </tr>
    `;

    tabela.innerHTML = novaLinha + tabela.innerHTML;

    let totalBO = document.getElementById("total-bo");
    totalBO.innerText = parseInt(totalBO.innerText) + 1;

    document.getElementById("form-bo").reset();
    fecharModal();
}
