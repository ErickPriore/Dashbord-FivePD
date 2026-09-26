const API_URL = "http://SEU_IP_VPS:3000/api/boletins"; 

let todosBoletins = [];

function mudarAba(nomeAba) {
    const abas = document.querySelectorAll('.aba-conteudo');
    abas.forEach(aba => aba.classList.remove('active'));

    const links = document.querySelectorAll('.sidebar ul li a');
    links.forEach(link => link.classList.remove('active'));

    document.getElementById(`aba-${nomeAba}`).classList.add('active');
    document.getElementById(`nav-${nomeAba}`).classList.add('active');
}

async function carregarDadosFiveM() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro na requisição");

        const data = await response.json();
        todosBoletins = data.boletins || [];

        document.getElementById("total-bo").innerText = data.totalBo || 0;
        document.getElementById("total-prisoes").innerText = data.totalPrisoes || 0;
        document.getElementById("total-procurados").innerText = data.totalProcurados || 0;

        renderizarDashboard();
        renderizarBoletinsCompleto(todosBoletins);
        renderizarProcurados();

    } catch (error) {
        console.error("Erro ao carregar dados do servidor:", error);
        exibirMensagemErro();
    }
}

function renderizarDashboard() {
    const tabela = document.getElementById("lista-bo-dashboard");
    tabela.innerHTML = "";

    const recentes = todosBoletins.slice(0, 5);

    if (recentes.length === 0) {
        tabela.innerHTML = `<tr><td colspan="7" class="loading-td">Nenhum boletim registrado.</td></tr>`;
        return;
    }

    recentes.forEach(bo => {
        tabela.innerHTML += criarLinhaTabela(bo);
    });
}

function renderizarBoletinsCompleto(lista) {
    const tabela = document.getElementById("lista-bo-completa");
    tabela.innerHTML = "";

    if (lista.length === 0) {
        tabela.innerHTML = `<tr><td colspan="7" class="loading-td">Nenhum registro encontrado.</td></tr>`;
        return;
    }

    lista.forEach(bo => {
        tabela.innerHTML += criarLinhaTabela(bo);
    });
}

function renderizarProcurados() {
    const tabela = document.getElementById("lista-procurados");
    tabela.innerHTML = "";

    const procurados = todosBoletins.filter(b => b.status === "Procurado");

    if (procurados.length === 0) {
        tabela.innerHTML = `<tr><td colspan="7" class="loading-td">Nenhum indivíduo com alerta de procurado no momento.</td></tr>`;
        return;
    }

    procurados.forEach(bo => {
        const fotoHtml = bo.imagem 
            ? `<a href="${bo.imagem}" target="_blank" style="color: #38bdf8;"><i class="fa-solid fa-image"></i> Ver Foto</a>` 
            : `<span style="color: #64748b;">-</span>`;

        tabela.innerHTML += `
            <tr>
                <td>#BO-${bo.id}</td>
                <td style="color: #f87171; font-weight: bold;">${bo.suspeito}</td>
                <td>${bo.infracao}</td>
                <td>${bo.oficial}</td>
                <td>${bo.data}</td>
                <td><span class="badge red">Procurado</span></td>
                <td>${fotoHtml}</td>
            </tr>
        `;
    });
}

function criarLinhaTabela(bo) {
    let statusClass = "green";
    if (bo.status === "Fechado") statusClass = "red";
    if (bo.status === "Procurado") statusClass = "orange";

    const fotoHtml = bo.imagem 
        ? `<a href="${bo.imagem}" target="_blank" style="color: #38bdf8; text-decoration: none;"><i class="fa-solid fa-image"></i> Ver Foto</a>` 
        : `<span style="color: #64748b;">-</span>`;

    return `
        <tr>
            <td>#BO-${bo.id}</td>
            <td>${bo.oficial}</td>
            <td>${bo.suspeito}</td>
            <td>${bo.infracao}</td>
            <td>${bo.data}</td>
            <td><span class="badge ${statusClass}">${bo.status}</span></td>
            <td>${fotoHtml}</td>
        </tr>
    `;
}

function filtrarBOs() {
    const termo = document.getElementById("busca-bo").value.toLowerCase();
    const filtrados = todosBoletins.filter(bo => 
        bo.oficial.toLowerCase().includes(termo) ||
        bo.suspeito.toLowerCase().includes(termo) ||
        bo.infracao.toLowerCase().includes(termo) ||
        bo.id.toString().includes(termo)
    );
    renderizarBoletinsCompleto(filtrados);
}

function exibirMensagemErro() {
    const msg = `<tr><td colspan="7" style="text-align: center; color: #f87171; padding: 20px;">
        <i class="fa-solid fa-plug-circle-xmark"></i> Não foi possível conectar ao servidor FivePD SP.
    </td></tr>`;
    
    document.getElementById("lista-bo-dashboard").innerHTML = msg;
    document.getElementById("lista-bo-completa").innerHTML = msg;
    document.getElementById("lista-procurados").innerHTML = msg;
}

function abrirModal() { document.getElementById("modal-bo").style.display = "flex"; }
function fecharModal() { document.getElementById("modal-bo").style.display = "none"; }

async function salvarBO(event) {
    event.preventDefault();

    const oficial = document.getElementById("oficial").value;
    const suspeito = document.getElementById("suspeito").value;
    const infracao = document.getElementById("infracao").value;
    const status = document.getElementById("status").value;
    const imagem = document.getElementById("imagem").value;
    const descricao = document.getElementById("descricao").value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oficial, suspeito, infracao, status, imagem, descricao })
        });

        if (response.ok) {
            alert("Boletim registrado com sucesso!");
            document.getElementById("form-bo").reset();
            fecharModal();
            carregarDadosFiveM();
        } else {
            alert("Erro ao salvar o boletim no servidor.");
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Falha de comunicação com a API do servidor.");
    }
}

window.onload = carregarDadosFiveM;
