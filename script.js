// URL da API ou Webhook que conecta o FiveM ao site
const API_URL = "https://SEU-SERVIDOR-OU-API.com/api/boletins"; 

// Função para carregar dados reais vindos do servidor FiveM
async function carregarDadosFiveM() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Atualizar contadores
        document.getElementById("total-bo").innerText = data.totalBo || 0;
        document.getElementById("total-prisoes").innerText = data.totalPrisoes || 0;
        document.getElementById("total-procurados").innerText = data.totalProcurados || 0;

        const tabela = document.getElementById("lista-bo");
        tabela.innerHTML = ""; // Limpa a mensagem "A carregar dados..."

        if (!data.boletins || data.boletins.length === 0) {
            tabela.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #94a3b8;">Nenhum boletim de ocorrência registrado.</td></tr>`;
            return;
        }

        // Renderiza cada boletim vindo da base de dados do FiveM
        data.boletins.forEach(bo => {
            const statusClass = bo.status === "Fechado" ? "red" : "green";
            const linha = `
                <tr>
                    <td>#BO-${bo.id}</td>
                    <td>${bo.oficial}</td>
                    <td>${bo.suspeito}</td>
                    <td>${bo.infracao}</td>
                    <td>${bo.data}</td>
                    <td><span class="badge ${statusClass}">${bo.status}</span></td>
                </tr>
            `;
            tabela.innerHTML += linha;
        });
    } catch (error) {
        console.error("Erro ao carregar dados do FiveM:", error);
        document.getElementById("lista-bo").innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #f87171;">Aguardando conexão com o servidor FiveM...</td>
            </tr>`;
    }
}

// Funções do Modal
function abrirModal() {
    document.getElementById("modal-bo").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal-bo").style.display = "none";
}

function salvarBO(event) {
    event.preventDefault();
    // Aqui podes adicionar o envio para a API via POST
    alert("Para enviar dados para o jogo, configure a integração da API no servidor.");
    fecharModal();
}

// Carrega os dados assim que a página abre
window.onload = carregarDadosFiveM;
