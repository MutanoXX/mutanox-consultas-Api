// MutanoX Dashboard v2.0 - JavaScript
const API_BASE = '';
let adminKey = localStorage.getItem('mutanox_admin_key') || '';
let refreshInterval = null;
let mainChart = null;
let pieChart = null;
let barChart = null;

// Endpoints configuration
const endpoints = {
    'cpf': { name: 'Consultar CPF', icon: 'fa-id-card', color: '#10b981', desc: 'Consulta completa de dados pessoais' },
    'nome': { name: 'Consultar Nome', icon: 'fa-user', color: '#6366f1', desc: 'Busca por nome completo' },
    'numero': { name: 'Consultar Telefone', icon: 'fa-phone', color: '#f59e0b', desc: 'Consulta de dados telefônicos' },
    'bypasscf': { name: 'Bypass Cloudflare', icon: 'fa-shield-virus', color: '#ef4444', desc: 'Bypass de proteção Cloudflare' },
    'infoff': { name: 'Free Fire Info', icon: 'fa-gamepad', color: '#8b5cf6', desc: 'Informações de conta Free Fire' },
    'downloader': { name: 'AIO Downloader', icon: 'fa-download', color: '#06b6d4', desc: 'Download de mídias de múltiplas plataformas' },
    'github': { name: 'GitHub Search', icon: 'fab fa-github', color: '#24292f', desc: 'Busca de usuários e repositórios' },
    'gimage': { name: 'Google Images', icon: 'fab fa-google', color: '#ea4335', desc: 'Busca de imagens' },
    'pinterest': { name: 'Pinterest Search', icon: 'fab fa-pinterest', color: '#bd081c', desc: 'Busca de pins e boards' },
    'roblox': { name: 'Roblox Stalk', icon: 'fas fa-cube', color: '#ff3d00', desc: 'Informações de usuários Roblox' },
    'tiktok': { name: 'TikTok Search', icon: 'fab fa-tiktok', color: '#00f2ea', desc: 'Busca de perfis e vídeos TikTok' },
    'yt': { name: 'YouTube Search', icon: 'fab fa-youtube', color: '#ff0000', desc: 'Busca de vídeos no YouTube' },
    'video': { name: 'Text to Video', icon: 'fas fa-video', color: '#8b5cf6', desc: 'Geração de vídeos a partir de texto' },
    'nsfw': { name: 'NSFW Generator', icon: 'fas fa-image', color: '#f97316', desc: 'Geração de imagens NSFW' },
    'clima': { name: 'Clima Tempo', icon: 'fas fa-cloud-sun', color: '#38bdf8', desc: 'Previsão do tempo' },
    'cotacao': { name: 'Cotação Moedas', icon: 'fas fa-dollar-sign', color: '#22c55e', desc: 'Cotação em tempo real' },
    'qrcode': { name: 'Gerador QR Code', icon: 'fas fa-qrcode', color: '#ffffff', desc: 'Geração de QR Codes' },
    'shorten': { name: 'Encurtador URL', icon: 'fas fa-link', color: '#f472b6', desc: 'Encurtamento de URLs' }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (adminKey) {
        showDashboard();
        initCharts();
        startAutoRefresh();
    }
});

// Login
window.login = async function() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    if (!username || !password) {
        showToast('error', 'Preencha todos os campos');
        return;
    }

    try {
        const response = await fetch('/api/admin/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            adminKey = data.adminKey;
            localStorage.setItem('mutanox_admin_key', adminKey);
            showToast('success', 'Autenticado com sucesso');
            showDashboard();
            initCharts();
            startAutoRefresh();
        } else {
            const errorEl = document.getElementById('login-error');
            errorEl.classList.remove('hidden');
            setTimeout(() => errorEl.classList.add('hidden'), 3000);
            showToast('error', data.message || 'Credenciais inválidas');
        }
    } catch (error) {
        showToast('error', 'Erro de conexão');
    }
};

window.logout = function() {
    localStorage.removeItem('mutanox_admin_key');
    location.reload();
};

// Show Dashboard
function showDashboard() {
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
}

// Section Navigation
window.showSection = function(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(`section-${sectionId}`).classList.add('active');

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find and activate the clicked button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(getSectionName(sectionId))) {
            btn.classList.add('active');
        }
    });

    // Load section-specific data
    if (sectionId === 'keys') loadKeys();
    if (sectionId === 'endpoints') loadEndpoints();
    if (sectionId === 'logs') loadLogs();
    if (sectionId === 'protection') loadProtectionList();
};

function getSectionName(sectionId) {
    const names = {
        'dashboard': 'dashboard',
        'stats': 'estatísticas',
        'keys': 'api keys',
        'endpoints': 'endpoints',
        'logs': 'logs',
        'protection': 'proteção',
        'test': 'testar api'
    };
    return names[sectionId] || '';
}

// Initialize Charts
function initCharts() {
    initMainChart();
    initPieChart();
    initBarChart();
}

function initMainChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Requests',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 8,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(99, 102, 241, 0.1)' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initPieChart() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#10b981', '#6366f1', '#f59e0b', '#8b5cf6',
                    '#ef4444', '#06b6d4', '#38bdf8', '#f97316'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#64748b', padding: 20, font: { size: 13 } }
                }
            },
            cutout: '60%'
        }
    });
}

function initBarChart() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Acessos',
                data: [],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(99, 102, 241, 0.1)' },
                    ticks: { color: '#64748b' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b' }
                }
            }
        }
    });
}

// Auto Refresh
function startAutoRefresh() {
    refreshData();
    refreshInterval = setInterval(refreshData, 3000);
}

async function refreshData() {
    try {
        const response = await fetch(`/api/admin/stats-readonly?apikey=${adminKey}`);
        const data = await response.json();

        if (data.success) {
            updateDashboard(data);
            updateCharts(data);
        }
    } catch (e) {
        console.error('Error refreshing data:', e);
    }
}

function updateDashboard(data) {
    document.getElementById('stat-total').textContent = data.totalRequests.toLocaleString();
    document.getElementById('stat-keys').textContent = Object.keys(data.keys).length;

    const uptimeSeconds = Math.floor(data.uptime / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    document.getElementById('stat-uptime').textContent = `${hours}h ${minutes}m`;
}

function updateCharts(data) {
    // Update main chart
    if (mainChart) {
        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        mainChart.data.labels.push(now);
        mainChart.data.datasets[0].data.push(data.totalRequests);

        if (mainChart.data.labels.length > 20) {
            mainChart.data.labels.shift();
            mainChart.data.datasets[0].data.shift();
        }

        mainChart.update('none');
    }

    // Update pie chart
    if (pieChart) {
        const endpointNames = Object.keys(data.endpointHits);
        const endpointValues = Object.values(data.endpointHits);

        pieChart.data.labels = endpointNames.map(key => endpoints[key]?.name || key);
        pieChart.data.datasets[0].data = endpointValues;
        pieChart.update('none');
    }

    // Update bar chart
    if (barChart) {
        const sortedEndpoints = Object.entries(data.endpointHits)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        barChart.data.labels = sortedEndpoints.map(([key]) => endpoints[key]?.name || key);
        barChart.data.datasets[0].data = sortedEndpoints.map(([, value]) => value);
        barChart.update('none');
    }
}

// Keys Management
window.openCreateKeyModal = async function() {
    const owner = prompt('Nome do dono da chave:');
    const role = prompt('Função (user/admin):', 'user');

    if (owner) {
        try {
            const response = await fetch(`/api/admin/keys?owner=${encodeURIComponent(owner)}&role=${role}&apikey=${adminKey}`, { method: 'POST' });
            const data = await response.json();

            if (data.success) {
                showToast('success', 'Chave criada com sucesso');
                loadKeys();
            } else {
                showToast('error', data.error || 'Erro ao criar chave');
            }
        } catch (e) {
            showToast('error', 'Erro de conexão');
        }
    }
};

window.deleteKey = async function(key) {
    if (!confirm('Tem certeza que deseja excluir esta chave?')) return;

    try {
        const response = await fetch(`/api/admin/keys?target=${key}&apikey=${adminKey}`, { method: 'DELETE' });
        const data = await response.json();

        if (data.success) {
            showToast('success', 'Chave excluída com sucesso');
            loadKeys();
        } else {
            showToast('error', data.error || 'Erro ao excluir chave');
        }
    } catch (e) {
        showToast('error', 'Erro de conexão');
    }
};

async function loadKeys() {
    try {
        const response = await fetch(`/api/admin/stats-readonly?apikey=${adminKey}`);
        const data = await response.json();

        if (data.success) {
            const tbody = document.getElementById('keys-table-body');
            tbody.innerHTML = Object.entries(data.keys).map(([key, info]) => `
                <tr>
                    <td><code style="background: rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 4px; color: #10b981;">${key.substring(0, 20)}...</code></td>
                    <td><strong>${info.owner}</strong></td>
                    <td><span class="badge ${info.role === 'admin' ? 'badge-admin' : 'badge-user'}">${info.role}</span></td>
                    <td><span class="badge ${info.active ? 'badge-active' : 'badge-inactive'}">${info.active ? 'Ativa' : 'Inativa'}</span></td>
                    <td>${info.usageCount || 0}</td>
                    <td>
                        <button onclick="deleteKey('${key}')" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading keys:', e);
    }
}

// Endpoints Management
async function loadEndpoints() {
    try {
        const response = await fetch(`/api/admin/endpoints?apikey=${adminKey}`);
        const data = await response.json();

        if (data.success && data.endpoints) {
            const grid = document.getElementById('endpoints-grid');
            grid.innerHTML = Object.entries(data.endpoints).map(([key, endpoint]) => {
                const endpointInfo = endpoints[key] || { name: key, icon: 'fa-plug', color: '#64748b', desc: 'Endpoint' };
                return `
                    <div class="card endpoint-card">
                        <div class="endpoint-header">
                            <div class="endpoint-icon" style="background: linear-gradient(135deg, ${endpointInfo.color} 0%, ${endpointInfo.color}dd 100%);">
                                <i class="fas ${endpointInfo.icon}"></i>
                            </div>
                            <div class="endpoint-name">${endpointInfo.name}</div>
                        </div>
                        <div class="endpoint-stats">
                            <div>
                                <div class="endpoint-hits">${endpoint.hits || 0}</div>
                                <div class="endpoint-label">Acessos</div>
                            </div>
                            <div style="text-align: right;">
                                <span class="badge ${endpoint.active ? 'badge-active' : 'badge-inactive'}">
                                    ${endpoint.active ? 'Ativo' : 'Manutenção'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (e) {
        console.error('Error loading endpoints:', e);
    }
}

window.toggleEndpoint = async function(endpoint) {
    try {
        const response = await fetch('/api/admin/endpoints/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint, apikey: adminKey })
        });
        const data = await response.json();

        if (data.success) {
            showToast('success', 'Endpoint atualizado com sucesso');
            loadEndpoints();
        } else {
            showToast('error', data.error || 'Erro ao atualizar endpoint');
        }
    } catch (e) {
        showToast('error', 'Erro de conexão');
    }
};

// Logs
async function loadLogs() {
    try {
        const response = await fetch(`/api/admin/stats-readonly?apikey=${adminKey}`);
        const data = await response.json();

        if (data.success) {
            const terminal = document.getElementById('terminal');
            terminal.innerHTML = (data.logs || []).map(log => `
                <div class="log-entry">
                    <span class="log-time">[${new Date().toLocaleTimeString('pt-BR')}]</span>
                    <span class="log-type-${log.type.toLowerCase()}">${log.type.toUpperCase()}</span>
                    <span class="log-message">${log.message}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading logs:', e);
    }
}

window.refreshLogs = function() {
    loadLogs();
    showToast('info', 'Logs atualizados');
};

// Protection
window.addProtection = async function() {
    const nome = document.getElementById('prot-nome').value.trim();
    const cpf = document.getElementById('prot-cpf').value.trim();
    const numero = document.getElementById('prot-numero').value.trim();
    const duration = document.getElementById('prot-duration').value.trim();

    if (!nome && !cpf && !numero) {
        showToast('error', 'Preencha pelo menos um campo');
        return;
    }

    try {
        const response = await fetch('/api/admin/protection/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome, cpf, numero, duration,
                apikey: adminKey
            })
        });
        const data = await response.json();

        if (data.success) {
            showToast('success', 'Proteção adicionada com sucesso');
            clearProtectionForm();
            loadProtectionList();
        } else {
            showToast('error', data.error || 'Erro ao adicionar proteção');
        }
    } catch (e) {
        showToast('error', 'Erro de conexão');
    }
};

window.clearProtectionForm = function() {
    document.getElementById('prot-nome').value = '';
    document.getElementById('prot-cpf').value = '';
    document.getElementById('prot-numero').value = '';
    document.getElementById('prot-duration').value = '';
};

window.removeProtection = async function(id) {
    if (!confirm('Remover esta proteção?')) return;

    try {
        const response = await fetch('/api/admin/protection/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, apikey: adminKey })
        });
        const data = await response.json();

        if (data.success) {
            showToast('success', 'Proteção removida com sucesso');
            loadProtectionList();
        } else {
            showToast('error', data.error || 'Erro ao remover proteção');
        }
    } catch (e) {
        showToast('error', 'Erro de conexão');
    }
};

async function loadProtectionList() {
    try {
        const response = await fetch('/api/admin/protection/list?apikey=${adminKey}`);
        const data = await response.json();

        if (data.success) {
            const list = document.getElementById('protection-list-items');
            list.innerHTML = (data.list || []).map(item => `
                <div class="protection-item">
                    <div>
                        <strong style="font-size: 15px;">${item.nome || 'Sem Nome'}</strong>
                        <div style="color: #64748b; font-size: 13px; margin-top: 4px;">
                            ${item.cpf ? `CPF: ${item.cpf}` : ''}
                            ${item.numero ? `Telefone: ${item.numero}` : ''}
                        </div>
                    </div>
                    <button onclick="removeProtection('${item.id}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Error loading protection list:', e);
    }
}

// Test Query
window.updateTestFields = function() {
    const type = document.getElementById('test-type').value;
    const queryField = document.getElementById('test-query-field');
    const queryLabel = queryField.querySelector('label');
    const queryInput = queryField.querySelector('input');

    const labels = {
        'cpf': 'CPF',
        'nome': 'Nome',
        'numero': 'Telefone',
        'bypasscf': 'URL',
        'infoff': 'ID da Conta',
        'downloader': 'URL',
        'github': 'Nome de Usuário',
        'gimage': 'Query de Busca',
        'pinterest': 'Query de Busca',
        'roblox': 'Nome de Usuário',
        'tiktok': 'Nome de Usuário',
        'yt': 'Query de Busca',
        'video': 'Texto Prompt',
        'nsfw': 'Prompt',
        'clima': 'Cidade',
        'cotacao': 'Moeda',
        'qrcode': 'URL',
        'shorten': 'URL'
    };

    queryLabel.textContent = labels[type] || 'Query';
    queryInput.placeholder = `Digite ${labels[type] || 'o valor'}`;
};

window.testQuery = async function() {
    const type = document.getElementById('test-type').value;
    const query = document.getElementById('test-query').value.trim();
    const apikey = document.getElementById('test-apikey').value.trim() || 'MutanoXX';

    if (!query) {
        showToast('error', 'Preencha o campo de consulta');
        return;
    }

    const resultDiv = document.getElementById('test-result');
    const resultContent = document.getElementById('test-result-content');

    resultDiv.classList.remove('hidden');
    resultContent.textContent = 'Executando consulta...';

    try {
        const response = await fetch(`/api/consultas?tipo=${type}&q=${encodeURIComponent(query)}&apikey=${apikey}`);
        const data = await response.json();

        resultContent.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;

        if (data.sucesso) {
            showToast('success', 'Consulta executada com sucesso');
        } else {
            showToast('error', data.erro || 'Erro na consulta');
        }
    } catch (e) {
        resultContent.innerHTML = `<pre style="color: #ef4444;">Erro: ${e.message}</pre>`;
        showToast('error', 'Erro de conexão');
    }
};

// Toast
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// Chart Range
window.setChartRange = function(range) {
    document.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    showToast('info', `Filtrando por ${range}`);
};
