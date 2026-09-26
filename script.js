// URL da tua API em Node.js (Altera para o IP da tua VPS e porta configurada)
const API_URL = "http://SEU_IP_VPS:3000/api/boletins";

/**
 * Procura os dados reais do MySQL através da API Node.js
 */
async function carregarDadosFiveM() {
    const tabela = document.getElementById("lista-bo");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.statusText}`);
        }

        const data = await response.json();

        // Atualizar os cards de estatísticas
        document.getElementById("total-bo").innerText = data.totalBo || 0;
        document.getElementById("total-prisoes").innerText = data.totalPrisoes || 0;
        document.getElementById("total-procurados").innerText = data.totalProcurados || 0;

        // Limpar a mensagem de "A carregar..."
        tabela.innerHTML = "";

        // Verificar se existem boletins retornados
        if (!data.boletins || data.boletins.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: #94a3b8; padding: 20px;">
                        Nenhum boletim de ocorrência registrado no banco de dados.
                    </td>
                </tr>`;
            return;
        }

        // Renderizar cada linha da tabela com os dados do MySQL
        data.boletins.forEach(bo => {
            const statusClass = bo.status === "Fechado" ? "red" : "green";
            
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>#BO-${bo.id}</td>
                <td>${bo.oficial}</td>
                <td>${bo.suspeito}</td>
                <td>${bo.infracao}</td>
                <td>${bo.data}</td>
                <td><span class="badge ${statusClass}">${bo.status}</span></td>
            `;
            tabela.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao carregar dados do servidor FiveM:", error);
        
        tabela.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #f87171; padding: 20px;">
                    <i class="fa-solid fa-plug-circle-xmark"></i> 
                    Não foi possível conectar ao servidor FiveM. Verifique a API.
                </td>
            </tr>`;
    }
}

/**
 * Controlos da interface (Modal de Registro)
 */
function abrirModal() {
    document.getElementById("modal-bo").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal-bo").style.display = "none";
}

/**
 * Envia um novo B.O. diretamente para a API para salvar no MySQL
 */
async function salvarBO(event) {
    event.preventDefault();

    const oficial = document.getElementById("oficial").value;
    const suspeito = document.getElementById("suspeito").value;
    const infracao = document.getElementById("infracao").value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                oficial: oficial,
                suspeito: suspeito,
                infracao: infracao
            })
        });

        if (response.ok) {
            alert("Boletim registrado com sucesso!");
            document.getElementById("form-bo").reset();
            fecharModal();
            carregarDadosFiveM(); // Atualiza a lista automaticamente
        } else {
            alert("Erro ao salvar o boletim no servidor.");
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Falha de comunicação com a API do servidor.");
    }
}

// Executa a busca de dados assim que a página é carregada
window.onload = carregarDadosFiveM;
