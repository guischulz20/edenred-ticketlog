
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

const storageKey = 'acompanhamento_chamados_final';
const listaViewer = document.getElementById('listaViewer');

function loadAll() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function renderSteps(status) {
  const container = document.createElement('div');
  container.className = 'steps';
  STEPS.forEach((label, idx) => {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step ' + (idx < status ? 'done' : idx === status ? 'active' : 'pending');
    stepDiv.innerHTML = `<div class="bubble">${idx+1}</div><div class="label">${label}</div>`;
    container.appendChild(stepDiv);
    if (idx < STEPS.length - 1) {
      const connector = document.createElement('div');
      connector.className = 'connector';
      container.appendChild(connector);
    }
  });
  return container;
}

function gerarLink(protocolo) {
  const all = loadAll();
  const chamado = all.find(c => c.protocolo === protocolo);
  if (!chamado) return alert('Chamado não encontrado');

  const link = `${window.location.origin}/cliente.html?protocolo=${encodeURIComponent(chamado.protocolo)}&placa=${encodeURIComponent(chamado.placa)}&status=${encodeURIComponent(chamado.status)}`;
  navigator.clipboard.writeText(link);
  alert('Link copiado: ' + link);
}

function renderLista(chamados) {
  listaViewer.innerHTML = '';
  if (!chamados.length) {
    listaViewer.innerHTML = '<p>Nenhum chamado encontrado.</p>';
    return;
  }

  chamados.forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `
      <div class="info"><strong>Protocolo:</strong> ${c.protocolo} | <strong>Placa:</strong> ${c.placa}</div>
      <div class="actions">
        <button onclick="gerarLink('${c.protocolo}')">Gerar link para cliente</button>
      </div>
    `;
    div.appendChild(renderSteps(c.status));
    listaViewer.appendChild(div);
  });
}

function filtrarViewer() {
  const q = document.getElementById('searchViewer').value.trim().toLowerCase();
  if (!q) {
    renderLista(loadAll());
    return;
  }
  const all = loadAll();
  const filtered = all.filter(c => c.placa.toLowerCase() === q || c.protocolo.toLowerCase() === q);
  renderLista(filtered);
}

function mostrarTodosViewer() {
  document.getElementById('searchViewer').value = '';
  renderLista(loadAll());
}

setInterval(() => {
  const q = document.getElementById('searchViewer').value.trim();
  if (!q) renderLista(loadAll());
}, 1000);

renderLista(loadAll());


