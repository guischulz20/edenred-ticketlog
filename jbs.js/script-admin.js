const storageKey = 'acompanhamento_chamados_final';
const listaDiv = document.getElementById('listaChamados');

const STEPS = [
  'Emitido protocolo',
  'Em atendimento',
  'Contato com o motorista',
  'Procurando prestador',
  'Prestador encontrado',
  'Solicitando acordo',
  'Prestador em rota',
  'Prestador no local',
  'Prestador finalizando',
  'Serviço finalizado'
];

function loadAll() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function saveAll(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function adicionarChamado() {
  const protocolo = document.getElementById('protocolo').value.trim();
  const placa = document.getElementById('placa').value.trim();
  const status = parseInt(document.getElementById('status').value);

  if (!protocolo || !placa) return alert('Preencha protocolo e placa');

  const all = loadAll();
  const index = all.findIndex(c => c.protocolo === protocolo);

  if (index >= 0) {
    all[index].placa = placa;
    all[index].status = status;
  } else {
    all.push({ protocolo, placa, status });
  }

  saveAll(all);
  renderLista(loadAll());
  limparForm();
}

function limparForm() {
  document.getElementById('protocolo').value = '';
  document.getElementById('placa').value = '';
  document.getElementById('status').value = '0';
}

function renderLista(chamados) {
  listaDiv.innerHTML = '';

  if (!chamados.length) {
    listaDiv.innerHTML = '<p>Nenhum chamado cadastrado.</p>';
    return;
  }

  chamados.forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';

    let options = STEPS.map((s, idx) => `<option value="${idx}" ${idx === c.status ? 'selected' : ''}>${s}</option>`).join('');
    
    div.innerHTML = `
      <div class="info">
        <strong>Chamado:</strong> ${c.protocolo} |
        <strong>Placa:</strong> ${c.placa} |
        <strong>Status:</strong> 
        <select onchange="alterarStatus('${c.protocolo}', this.value)">${options}</select>
      </div>
      <div>
        <button class="link" onclick="gerarLink('${c.protocolo}')">Gerar link</button>
        <button class="delete" onclick="excluirChamado('${c.protocolo}')">Excluir</button>
      </div>
    `;
    listaDiv.appendChild(div);
  });
}

function alterarStatus(protocolo, value) {
  const all = loadAll();
  const item = all.find(c => c.protocolo === protocolo);
  if (item) {
    item.status = parseInt(value);
    saveAll(all);
    renderLista(loadAll());
  }
}

function excluirChamado(protocolo) {
  let all = loadAll();
  all = all.filter(c => c.protocolo !== protocolo);
  saveAll(all);
  renderLista(all);
}

function filtrarChamados() {
  const q = document.getElementById('searchAdmin').value.trim().toLowerCase();
  const all = loadAll();
  const filtered = all.filter(c => c.placa.toLowerCase().includes(q) || c.protocolo.toLowerCase().includes(q));
  renderLista(filtered);
}

function mostrarTodos() {
  document.getElementById('searchAdmin').value = '';
  renderLista(loadAll());
}

function gerarLink(protocolo) {
  const link = `${window.location.origin}/cliente.html?protocolo=${encodeURIComponent(protocolo)}`;
  navigator.clipboard.writeText(link);
  alert('Link copiado: ' + link);
}

// Inicializa
renderLista(loadAll());
