// MutanoX Dashboard v3.0 - Melhorado e Corrigido
const API_BASE = '';
let adminKey = localStorage.getItem('mutanox_admin_key') || '';
let refreshInterval = null;
let mainChart = null;
let pieChart = null;
let barChart = null;
let endpointsData = [];

// Endpoints configuration
const endpoints = {
    'cpf': { name: 'Consultar CPF', icon: 'fa-id-card', color: '#10b981', desc: 'Consulta completa de dados pessoais' },
    'nome': { name: 'Consultar Nome', icon: 'fa-user', color: '#6366f1', desc: 'Busca por nome completo' },
    'numero': { name: 'Consultar Telefone', icon: 'fa-phone', color: '#f59e0b', desc: 'Consulta de dados telefonicos' },
    'bypass': { name: 'Bypass City', icon: 'fa-unlock-alt', color: '#8b5cf6', desc: 'Bypass de proteção' },
    'bypasscf': { name: 'Bypass Cloudflare', icon: 'fa-shield-virus', color: '#ef4444', desc: 'Bypass de protecao CF' },
    'infoff': { name: 'Free Fire Info', icon: 'fa-gamepad', color: '#8b5cf6', desc: 'Informacoes de conta Free Fire' },
    'downloader': { name: 'AIO Downloader', icon: 'fa-download', color: '#06b6d4', desc: 'Download de midias' },
    'github': { name: 'GitHub Search', icon: 'fab fa-github', color: '#24292f', desc: 'Busca de usuarios' },
    'gimage': { name: 'Google Images', icon: 'fab fa-google', color: '#ea4335', desc: 'Busca de imagens' },
    'pinterest': { name: 'Pinterest Search', icon: 'fab fa-pinterest', color: '#bd081c', desc: 'Busca de pins' },
    'roblox': { name: 'Roblox Stalk', icon: 'fas fa-cube', color: '#ff3d00', desc: 'Info de usuarios Roblox' },
    'tiktok': { name: 'TikTok Search', icon: 'fab fa-tiktok', color: '#00f2ea', desc: 'Busca de perfis' },
    'yt': { name: 'YouTube Search', icon: 'fab fa-youtube', color: '#ff0000', desc: 'Busca de videos' },
    'video': { name: 'Text to Video', icon: 'fas fa-video', color: '#8b5cf6', desc: 'Geracao de videos' },
    'nsfw': { name: 'NSFW Generator', icon: 'fas fa-image', color: '#f97316', desc: 'Geracao de imagens' },
    'clima': { name: 'Clima Tempo', icon: 'fas fa-cloud-sun', color: '#38bdf8', desc: 'Previsao do tempo' },
    'cotacao': { name: 'Cotacao Moedas', icon: 'fas fa-dollar-sign', color: '#22c55e', desc: 'Cotacao em tempo real' },
    'qrcode': { name: 'Gerador QR Code', icon: 'fas fa-qrcode', color: '#ffffff', desc: 'Gera QR Code' },
    'shorten': { name: 'Encurtador URL', icon: 'fas fa-link', color: '#f472b6', desc: 'Encurta links' }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (adminKey) {
        showDashboard();
        initCharts();
        startAutoRefresh();
    }
});

// Login
window.login = async function() {
    var username = document.getElementById('admin-username').value.trim();
    var password = document.getElementById('admin-password').value.trim();

    if (!username || !password) {
        showToast('error', 'Preencha todos os campos');
        return;
    }

    try {
        var response = await fetch('/api/admin/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });

        var data = await response.json();

        if (response.ok && data.success) {
            adminKey = data.adminKey;
            localStorage.setItem('mutanox_admin_key', adminKey);
            showToast('success', 'Autenticado com sucesso');
            showDashboard();
            initCharts();
            startAutoRefresh();
        } else {
            var errorEl = document.getElementById('login-error');
            errorEl.classList.remove('hidden');
            setTimeout(function() { errorEl.classList.add('hidden'); }, 3000);
            showToast('error', data.message || 'Credenciais invalidas');
        }
    } catch (error) {
        showToast('error', 'Erro de conexao');
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
    document.querySelectorAll('.content-section').forEach(function(section) {
        section.classList.remove('active');
    });

    var section = document.getElementById('section-' + sectionId);
    if (section) {
        section.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.classList.remove('active');
    });

    var clickedBtn = event.target;
    while (clickedBtn && !clickedBtn.classList.contains('nav-btn')) {
        clickedBtn = clickedBtn.parentElement;
    }
    if (clickedBtn && clickedBtn.classList.contains('nav-btn')) {
        clickedBtn.classList.add('active');
    }

    if (sectionId === 'keys') loadKeys();
    if (sectionId === 'endpoints') loadEndpoints();
    if (sectionId === 'logs') loadLogs();
    if (sectionId === 'protection') loadProtectionList();
    if (sectionId === 'test') updateTestFields();
};

// Initialize Charts
function initCharts() {
    initMainChart();
    initPieChart();
    initBarChart();
}

function initMainChart() {
    var ctx = document.getElementById('mainChart');
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
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(99, 102, 241, 0.1)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

function initPieChart() {
    var ctx = document.getElementById('pieChart');
    if (!ctx) return;

    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#38bdf8', '#f97316'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#64748b', padding: 20, font: { size: 13 } } }
            },
            cutout: '60%'
        }
    });
}

function initBarChart() {
    var ctx = document.getElementById('barChart');
    if (!ctx) return;

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Acessos',
                data: [],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(99, 102, 241, 0.1)' }, ticks: { color: '#64748b' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
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
        var response = await fetch('/api/admin/stats-readonly?apikey=' + adminKey);
        var data = await response.json();

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

    var uptimeSeconds = Math.floor(data.uptime / 1000);
    var hours = Math.floor(uptimeSeconds / 3600);
    var minutes = Math.floor((uptimeSeconds % 3600) / 60);
    document.getElementById('stat-uptime').textContent = hours + 'h ' + minutes + 'm';
}

function updateCharts(data) {
    // Atualizar main chart
    if (mainChart) {
        var now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        mainChart.data.labels.push(now);
        mainChart.data.datasets[0].data.push(data.totalRequests);

        if (mainChart.data.labels.length > 20) {
            mainChart.data.labels.shift();
            mainChart.data.datasets[0].data.shift();
        }

        mainChart.update('none');
    }

    // Atualizar pie chart
    if (pieChart && data.endpointHits) {
        var endpointNames = Object.keys(data.endpointHits);
        var endpointValues = Object.values(data.endpointHits);

        pieChart.data.labels = endpointNames.map(function(key) { return endpoints[key] ? endpoints[key].name : key; });
        pieChart.data.datasets[0].data = endpointValues;
        pieChart.update('none');
    }

    // Atualizar bar chart
    if (barChart && data.endpointHits) {
        var sortedEndpoints = Object.entries(data.endpointHits)
            .sort(function(a, b) { return b[1] - a[1]; })
            .slice(0, 5);

        barChart.data.labels = sortedEndpoints.map(function(entry) { return endpoints[entry[0]] ? endpoints[entry[0]].name : entry[0]; });
        barChart.data.datasets[0].data = sortedEndpoints.map(function(entry) { return entry[1]; });
        barChart.update('none');
    }
}

// Endpoints Management - CORRIGIDO
async function loadEndpoints() {
    try {
        var response = await fetch('/api/admin/endpoints?apikey=' + adminKey);
        var data = await response.json();

        if (data.success && data.endpoints) {
            endpointsData = data.endpoints;
            var grid = document.getElementById('endpoints-grid');
            grid.innerHTML = '';

            Object.entries(data.endpoints).forEach(function(entry) {
                var key = entry[0];
                var endpoint = entry[1];
                var endpointInfo = endpoints[key] || { name: key, icon: 'fa-plug', color: '#64748b', desc: 'Endpoint' };

                var card = document.createElement('div');
                card.className = 'card endpoint-card';
                card.innerHTML = '' +
                    '<div class="endpoint-header">' +
                        '<div class="endpoint-icon" style="background: linear-gradient(135deg, ' + endpointInfo.color + ' 0%, ' + endpointInfo.color + 'dd 100%);">' +
                            '<i class="fas ' + endpointInfo.icon + '"></i>' +
                        '</div>' +
                        '<div class="endpoint-name">' + endpointInfo.name + '</div>' +
                    '</div>' +
                    '<div class="endpoint-stats">' +
                        '<div>' +
                            '<div class="endpoint-hits">' + (endpoint.hits || 0) + '</div>' +
                            '<div class="endpoint-label">Acessos</div>' +
                        '</div>' +
                        '<div style="text-align: right;">' +
                            '<span class="badge ' + (endpoint.active ? 'badge-active' : 'badge-inactive') + '">' +
                                (endpoint.active ? 'Ativo' : 'Manutencao') +
                            '</span>' +
                        '</div>' +
                    '</div>' +
                    '';

                grid.appendChild(card);
            });
        }
    } catch (e) {
        console.error('Error loading endpoints:', e);
        showToast('error', 'Erro ao carregar endpoints');
    }
}

// Keys Management
window.openCreateKeyModal = async function() {
    var owner = prompt('Nome do dono da chave:');
    var role = prompt('Funcao (user/admin):', 'user');

    if (owner) {
        try {
            var response = await fetch('/api/admin/keys?owner=' + encodeURIComponent(owner) + '&role=' + role + '&apikey=' + adminKey, { method: 'POST' });
            var data = await response.json();

            if (data.success) {
                showToast('success', 'Chave criada com sucesso');
                loadKeys();
            } else {
                showToast('error', data.error || 'Erro ao criar chave');
            }
        } catch (e) {
            showToast('error', 'Erro de conexao');
        }
    }
};

window.deleteKey = async function(key) {
    if (!confirm('Tem certeza que deseja excluir esta chave?')) return;

    try {
        var response = await fetch('/api/admin/keys?target=' + key + '&apikey=' + adminKey, { method: 'DELETE' });
        var data = await response.json();

        if (data.success) {
            showToast('success', 'Chave excluida com sucesso');
            loadKeys();
        } else {
            showToast('error', data.error || 'Erro ao excluir chave');
        }
    } catch (e) {
        showToast('error', 'Erro de conexao');
    }
};

async function loadKeys() {
    try {
        var response = await fetch('/api/admin/stats-readonly?apikey=' + adminKey);
        var data = await response.json();

        if (data.success) {
            var tbody = document.getElementById('keys-table-body');
            tbody.innerHTML = Object.entries(data.keys).map(function(entry) {
                var key = entry[0];
                var info = entry[1];
                var badgeClass = info.role === 'admin' ? 'badge-admin' : 'badge-user';
                var statusClass = info.active ? 'badge-active' : 'badge-inactive';
                var statusText = info.active ? 'Ativa' : 'Inativa';

                return '<tr>' +
                    '<td><code style="background: rgba(16, 185, 129, 0.2); padding: 4px 8px; border-radius: 4px; color: #10b981;">' + key.substring(0, 20) + '...</code></td>' +
                    '<td><strong>' + info.owner + '</strong></td>' +
                    '<td><span class="badge ' + badgeClass + '">' + info.role + '</span></td>' +
                    '<td><span class="badge ' + statusClass + '">' + statusText + '</span></td>' +
                    '<td>' + (info.usageCount || 0) + '</td>' +
                    '<td>' +
                        '<button onclick="deleteKey(\'' + key + '\')" class="btn btn-danger btn-sm">' +
                            '<i class="fas fa-trash"></i>' +
                        '</button>' +
                    '</td>' +
                    '</tr>';
            }).join('');
        }
    } catch (e) {
        console.error('Error loading keys:', e);
    }
}

// Logs
async function loadLogs() {
    try {
        var response = await fetch('/api/admin/stats-readonly?apikey=' + adminKey);
        var data = await response.json();

        if (data.success) {
            var terminal = document.getElementById('terminal');
            terminal.innerHTML = (data.logs || []).map(function(log) {
                return '<div class="log-entry">' +
                    '<span class="log-time">[' + new Date().toLocaleTimeString('pt-BR') + ']</span>' +
                    '<span class="log-type-' + log.type.toLowerCase() + '">' + log.type.toUpperCase() + '</span>' +
                    '<span class="log-message">' + log.message + '</span>' +
                    '</div>';
            }).join('');
        }
    } catch (e) {
        console.error('Error loading logs:', e);
    }
}

window.refreshLogs = function() {
    loadLogs();
    showToast('info', 'Logs atualizados');
};

// Protection - MELHORADO
window.addProtection = async function() {
    var nome = document.getElementById('prot-nome').value.trim();
    var cpf = document.getElementById('prot-cpf').value.trim();
    var numero = document.getElementById('prot-numero').value.trim();
    var duration = document.getElementById('prot-duration').value.trim();
    var permanent = document.getElementById('prot-permanent') ? document.getElementById('prot-permanent').checked : false;

    if (!nome && !cpf && !numero) {
        showToast('error', 'Preencha pelo menos um campo');
        return;
    }

    try {
        var url = '/api/admin/protection/add?apikey=' + adminKey;
        if (nome) url += '&nome=' + encodeURIComponent(nome);
        if (cpf) url += '&cpf=' + cpf;
        if (numero) url += '&numero=' + numero;
        if (duration && !permanent) url += '&duration=' + duration;
        if (permanent) url += '&permanent=true';

        var response = await fetch(url, { method: 'POST' });
        var data = await response.json();

        if (data.success) {
            var message = permanent ? 'Protecao permanente adicionada!' : 'Protecao adicionada com sucesso!';
            showToast('success', message);
            clearProtectionForm();
            loadProtectionList();
        } else {
            showToast('error', data.error || 'Erro ao adicionar protecao');
        }
    } catch (e) {
        console.error('Erro ao adicionar protecao:', e);
        showToast('error', 'Erro de conexao');
    }
};

window.clearProtectionForm = function() {
    document.getElementById('prot-nome').value = '';
    document.getElementById('prot-cpf').value = '';
    document.getElementById('prot-numero').value = '';
    document.getElementById('prot-duration').value = '';
    if (document.getElementById('prot-permanent')) {
        document.getElementById('prot-permanent').checked = false;
    }
};

window.removeProtection = async function(id) {
    if (!confirm('Remover esta protecao?')) return;

    try {
        var response = await fetch('/api/admin/protection/remove?apikey=' + adminKey + '&id=' + id, { method: 'POST' });
        var data = await response.json();

        if (data.success) {
            showToast('success', 'Protecao removida com sucesso');
            loadProtectionList();
        } else {
            showToast('error', data.error || 'Erro ao remover protecao');
        }
    } catch (e) {
        console.error('Erro ao remover protecao:', e);
        showToast('error', 'Erro de conexao');
    }
};

async function loadProtectionList() {
    try {
        var response = await fetch('/api/admin/protection/list?apikey=' + adminKey);
        var data = await response.json();

        if (data.success) {
            var list = document.getElementById('protection-list-items');
            list.innerHTML = (data.list || []).map(function(item) {
                var permanentBadge = item.permanent ?
                    '<span class="badge" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white;">PERMANENTE</span>' : '';

                return '<div class="protection-item">' +
                    '<div>' +
                        '<strong style="font-size: 15px;">' + (item.nome || 'Sem Nome') + '</strong> ' +
                        permanentBadge +
                        '<div style="color: #64748b; font-size: 13px; margin-top: 4px;">' +
                            (item.cpf ? 'CPF: ' + item.cpf : '') +
                            (item.numero ? ' | Telefone: ' + item.numero : '') +
                        '</div>' +
                        '<div style="color: #10b981; font-size: 12px; margin-top: 2px;">' +
                            (item.permanent ? 'Protecao Eterna' : 'Expira: ' + (item.expiresAt ? new Date(item.expiresAt).toLocaleString('pt-BR') : 'N/A')) +
                        '</div>' +
                    '</div>' +
                    '<button onclick="removeProtection(\'' + item.id + '\')" class="btn btn-danger btn-sm">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                    '</div>';
            }).join('');
        }
    } catch (e) {
        console.error('Error loading protection list:', e);
    }
}

// Test Query
window.updateTestFields = function() {
    var type = document.getElementById('test-type').value;
    var queryField = document.getElementById('test-query-field');
    var queryLabel = queryField.querySelector('label');
    var queryInput = queryField.querySelector('input');

    var labels = {
        'cpf': 'CPF',
        'nome': 'Nome',
        'numero': 'Telefone',
        'bypass': 'URL',
        'bypasscf': 'URL',
        'infoff': 'ID da Conta',
        'downloader': 'URL',
        'github': 'Nome de Usuario',
        'gimage': 'Query de Busca',
        'pinterest': 'Query de Busca',
        'roblox': 'Nome de Usuario',
        'tiktok': 'Nome de Usuario',
        'yt': 'Query de Busca',
        'video': 'Texto Prompt',
        'nsfw': 'Prompt',
        'clima': 'Cidade',
        'cotacao': 'Moeda',
        'qrcode': 'URL',
        'shorten': 'URL'
    };

    queryLabel.textContent = labels[type] || 'Query';
    queryInput.placeholder = 'Digite ' + (labels[type] || 'o valor');
};

window.testQuery = async function() {
    var type = document.getElementById('test-type').value;
    var query = document.getElementById('test-query').value.trim();
    var apikey = document.getElementById('test-apikey').value.trim() || 'MutanoX3397';

    if (!query) {
        showToast('error', 'Preencha o campo de consulta');
        return;
    }

    var resultDiv = document.getElementById('test-result');
    var resultContent = document.getElementById('test-result-content');

    resultDiv.classList.remove('hidden');
    resultContent.textContent = 'Executando consulta...';

    try {
        var url = '/api/consultas?tipo=' + type + '&q=' + encodeURIComponent(query) + '&apikey=' + apikey;
        var response = await fetch(url);
        var data = await response.json();

        resultContent.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';

        if (data.sucesso) {
            showToast('success', 'Consulta executada com sucesso');
        } else {
            showToast('error', data.erro || 'Erro na consulta');
        }
    } catch (e) {
        resultContent.innerHTML = '<pre style="color: #ef4444;">Erro: ' + e.message + '</pre>';
        showToast('error', 'Erro de conexao');
    }
};

// Toast
function showToast(type, message) {
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i><span>' + message + '</span>';
    container.appendChild(toast);

    setTimeout(function() { toast.remove(); }, 3000);
}

// Chart Range
window.setChartRange = function(range) {
    document.querySelectorAll('.time-btn').forEach(function(btn) { btn.classList.remove('active'); });
    event.target.classList.add('active');
    showToast('info', 'Filtrando por ' + range);
};
