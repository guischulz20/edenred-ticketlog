
    function formatarMoeda(campo) {
      let valor = campo.value.replace(/\D/g, '');
      valor = (parseInt(valor, 10) / 100).toFixed(2);
      campo.value = 'R$ ' + valor.replace('.', ',');
    }

    function imprimirPix() {
      const form = document.getElementById('pixForm');
      document.getElementById('botaoCopiar').style.display = 'block';
      const assistenteAnterior = form.assistenteAnterior.value;
      const saudacao = form.saudacao.value;
      const servicoRealizado = form.servicoRealizado.value;
      const valorServico = form.valorServico.value;
      const tipoChave = form.tipoChave.value;
      const chavePix = form.chavePix.value;
      const nomeDestino = form.nomeDestino.value;
      const bancoDestino = form.bancoDestino.value;
      const protocolo = form.protocolo.value;
      const placa = form.placa.value;
      const cliente = form.cliente.value;

      let html = '';
      if (saudacao) html += `<p>${saudacao}</p>`;
      if (assistenteAnterior) html += `<p><strong>Assistente Anterior:</strong> ${assistenteAnterior}</p>`;
      if (servicoRealizado) html += `<p><strong>Serviço Realizado:</strong> ${servicoRealizado}</p>`;
      if (valorServico) html += `<p><strong>Valor do Serviço:</strong> ${valorServico}</p>`;
      if (tipoChave && chavePix) html += `<p><strong>Chave Pix:</strong> ${tipoChave} - ${chavePix}</p>`;
      if (nomeDestino) html += `<p><strong>Nome do Destino:</strong> ${nomeDestino}</p>`;
      if (bancoDestino) html += `<p><strong>Banco do Destino:</strong> ${bancoDestino}</p>`;
      if (protocolo) html += `<p><strong>Protocolo:</strong> ${protocolo}</p>`;
      if (placa) html += `<p><strong>Placa:</strong> ${placa}</p>`;
      if (cliente) html += `<p><strong>Cliente:</strong> ${cliente}</p>`;

      const output = document.getElementById('pixOutput');
      output.innerHTML = html || '<em>Nenhuma informação preenchida.</em>';
      output.style.display = 'block';
    }

    function limparPix() {
      document.getElementById('pixForm').reset();
      document.getElementById('botaoCopiar').style.display = 'none';
      const output = document.getElementById('pixOutput');
      output.innerHTML = '';
      output.style.display = 'none';
    }

     function copiarDados() {
  const output = document.getElementById('pixOutput');
  const texto = output.innerText;

  if (!texto.trim()) {
    alert('Nenhuma informação para copiar.');
    return;
  }

  navigator.clipboard.writeText(texto)
    .then(() => {
      alert('Dados copiados com sucesso!');
    })
    .catch(err => {
      alert('Erro ao copiar os dados: ' + err);
    });
}
    
