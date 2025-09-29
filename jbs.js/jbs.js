function togglePrestador(tipo) {
    document.getElementById('campoCredenciado').classList.toggle('hidden', tipo !== 'credenciado');
    document.getElementById('campoTerceiro').classList.toggle('hidden', tipo !== 'terceiro');
}

function formatarMoeda(campo) {
    let valor = campo.value.replace(/\D/g, "");
    valor = (valor / 100).toFixed(2) + "";
    valor = valor.replace(".", ",");
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    campo.value = "R$ " + valor;
}

function formatarDataHora(valor) {
    if (!valor) return '';
    const data = new Date(valor);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function gerarVisualizacao(titulo) {
    const form = document.forms['socorroForm'];
    const tipo = form.tipoPrestador.value;
    const nomePrestador = tipo === 'credenciado' ? form.nomeEC.value : form.prestadorTerceiro.value;
    const tipoTelefone = form.tipoTelefone.value === 'condutor' ? 'Condutor' : 'Fornecedor';
    const telefoneSelecionado = form.telefoneSelecionado.value;

    const deAcordoSelect = document.getElementById('deAcordoSelect');
    const nomeDeAcordo = document.getElementById('nomeDeAcordo');
    let deAcordo;
    if (deAcordoSelect.value === 'sim' && nomeDeAcordo.value.trim()) {
        deAcordo = `Sim - ${nomeDeAcordo.value.trim()}`;
    } else if (deAcordoSelect.value === 'sim') {
        deAcordo = 'Sim';
    } else if (deAcordoSelect.value === 'nao') {
        deAcordo = 'Não';
    } else {
        deAcordo = '';
    }

    const campos = [
        ['*Protocolo*', form.protocolo.value],
        ['*Assistente*', form.assistente.value],
        ['*Cliente*', form.cliente.value],
        ['*Placa*', form.placa.value],
        ['*Cidade*', form.cidade.value],
        ['*Segmento*', form.segmento.value],
        ['*Regional*', form.regional.value],
        ['*Tipo de Prestador*', tipo],
        [tipo === '*credenciado*' ? '*Nome do EC*' : '*Prestador Terceiro*', nomePrestador],
        ['*Cidade do Prestador*', form.cidadePrestador.value],
        [`*Telefone (${tipoTelefone})*`, telefoneSelecionado],
        ['*Valor por KM*', form.valorKM.value],
        ['*Valor de Saída*', form.valorSaida.value],
        ['*Quantidade de KM*', form.quantidadeKM.value],
        ['*Valor do Serviço*', form.valorServico.value],
        ['*De Acordo?*', deAcordo],
        ['*Início do SOS*', formatarDataHora(form.dataInicio.value)],
        ['*Fim do SOS*', formatarDataHora(form.dataFim.value)],
        ['*Serviço Realizado*', form.servicoRealizado.value]
    ];

    const camposPreenchidos = campos.filter(c => c[1] && c[1].trim() !== '');
    let html = `<h3>${titulo}</h3><ul>`;
    camposPreenchidos.forEach(c => {
        html += `<li><strong>${c[0]}:</strong> ${c[1]}</li>`;
    });
    html += `</ul>`;

    const visualizacao = document.getElementById('visualizacao');
    visualizacao.innerHTML = html;
    visualizacao.style.display = 'block';
}

function copiarVisualizacao() {
    const visualizacao = document.getElementById('visualizacao');
    if (!visualizacao.innerText.trim()) return;

    const titulo = visualizacao.querySelector('h3') ? visualizacao.querySelector('h3').innerText + '\n' : '';
    const conteudoCampos = Array.from(visualizacao.querySelectorAll('li')).map(li => li.innerText).join('\n');
    const textoFinal = titulo + conteudoCampos;

    navigator.clipboard.writeText(textoFinal).then(() => {
        alert('Conteúdo copiado para a área de transferência!');
    });
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const form = document.forms['socorroForm'];
    const tipo = form.tipoPrestador.value;
    const nomePrestador = tipo === 'credenciado' ? form.nomeEC.value : form.prestadorTerceiro.value;
    const tipoTelefone = form.tipoTelefone.value === 'condutor' ? 'Condutor' : 'Fornecedor';
    const telefoneSelecionado = form.telefoneSelecionado.value;

    const deAcordoSelect = document.getElementById('deAcordoSelect');
    const nomeDeAcordo = document.getElementById('nomeDeAcordo');
    let deAcordo;
    if (deAcordoSelect.value === 'sim' && nomeDeAcordo.value.trim()) {
        deAcordo = `Sim - ${nomeDeAcordo.value.trim()}`;
    } else if (deAcordoSelect.value === 'sim') {
        deAcordo = 'Sim';
    } else if (deAcordoSelect.value === 'nao') {
        deAcordo = 'Não';
    } else {
        deAcordo = '';
    }

    const campos = [
        ['Protocolo', form.protocolo.value],
        ['Assistente', form.assistente.value],
        ['Cliente', form.cliente.value],
        ['Placa', form.placa.value],
        ['Cidade', form.cidade.value],
        ['Segmento', form.segmento.value],
        ['Regional', form.regional.value],
        ['Tipo de Prestador', tipo],
        [tipo === 'credenciado' ? 'Nome do EC' : 'Prestador Terceiro', nomePrestador],
        ['Cidade do Prestador', form.cidadePrestador.value],
        [`Telefone (${tipoTelefone})`, telefoneSelecionado],
        ['Valor por KM', form.valorKM.value],
        ['Valor de Saída', form.valorSaida.value],
        ['Quantidade de KM', form.quantidadeKM.value],
        ['Valor do Serviço', form.valorServico.value],
        ['De Acordo?', deAcordo],
        ['Início do SOS', formatarDataHora(form.dataInicio.value)],
        ['Fim do SOS', formatarDataHora(form.dataFim.value)],
        ['Serviço Realizado', form.servicoRealizado.value]
    ];

    const camposPreenchidos = campos.filter(c => c[1] && c[1].trim() !== '');
    let y = 20;
    const margem = 15;
    const largura = 180;

    // Cabeçalho fixo "Resumo do Socorro"
    const titulo = "Resumo do Socorro";
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const paginaLargura = doc.internal.pageSize.getWidth();
    const tituloLargura = doc.getTextWidth(titulo);
    doc.text(titulo, (paginaLargura - tituloLargura) / 2, y);
    y += 12;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    camposPreenchidos.forEach(c => {
        const text = `${c[0]}: ${c[1]}`;
        const linhas = doc.splitTextToSize(text, largura);
        linhas.forEach(linha => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(linha, margem, y);
            y += 8;
        });
        y += 4;
    });

    const numeroProtocolo = form.protocolo.value.trim() || 'sem-protocolo';
    doc.save(`protocolo: ${numeroProtocolo}.pdf`);
}

function limparCampos() {
    document.getElementById('socorroForm').reset();
    document.getElementById('visualizacao').style.display = 'none';
    document.getElementById('campoCredenciado').classList.add('hidden');
    document.getElementById('campoTerceiro').classList.add('hidden');
}

