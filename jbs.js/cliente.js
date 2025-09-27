 

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
const statusContainer = document.getElementById('statusContainer');
const protocoloDisplay = document.getElementById('protocoloDisplay');
const placaDisplay = document.getElementById('placaDisplay');

function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

const filtroProtocolo = getQueryParam('protocolo');

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
    if (idx < STEPS.length-1) {
      const connector = document.createElement('div');
      connector.className = 'connector';
      container.appendChild(connector);
    }
  });
  return container;
}

function renderVeiculo() {
  const all = loadAll();
  const veiculo = all.find(c => c.protocolo === filtroProtocolo);

  if (!veiculo) {
    statusContainer.innerHTML = '<p>Veículo não encontrado.</p>';
    protocoloDisplay.textContent = '-';
    placaDisplay.textContent = '-';
    return;
  }

  protocoloDisplay.textContent = veiculo.protocolo;
  placaDisplay.textContent = veiculo.placa;
  statusContainer.innerHTML = '';
  statusContainer.appendChild(renderSteps(veiculo.status));
}

setInterval(renderVeiculo, 1000);
renderVeiculo();
