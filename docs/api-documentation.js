// MutanoX API Documentation v1.0
// Apenas os 15 endpoints de usuários (NÃO os de admin)

// Endpoints de usuários disponíveis
const userEndpoints = [
    {
        id: 'cpf',
        name: 'Consultar CPF',
        icon: 'fa-id-card',
        description: 'Consulta completa de dados pessoais',
        method: 'GET',
        url: '/api/consultas?tipo=cpf&cpf={cpf}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'cpf' },
            { name: 'cpf', type: 'string', required: true, description: 'CPF a consultar' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=cpf&cpf=12345678901&apikey=SUA_API_KEY"'
    },
    {
        id: 'nome',
        name: 'Consultar Nome',
        icon: 'fa-user',
        description: 'Busca por nome completo',
        method: 'GET',
        url: '/api/consultas?tipo=nome&q={query}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'nome' },
            { name: 'q', type: 'string', required: true, description: 'Nome completo para buscar' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=nome&q=Joao+Silva&apikey=SUA_API_KEY"'
    },
    {
        id: 'numero',
        name: 'Consultar Telefone',
        icon: 'fa-phone',
        description: 'Consulta de dados telefônicos',
        method: 'GET',
        url: '/api/consultas?tipo=numero&q={phone}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'numero' },
            { name: 'q', type: 'string', required: true, description: 'Número de telefone' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=numero&q=11999999999&apikey=SUA_API_KEY"'
    },
    {
        id: 'bypass',
        name: 'Bypass City',
        icon: 'fa-unlock-alt',
        description: 'Bypass de proteção',
        method: 'GET',
        url: '/api/consultas?tipo=bypass&url={url}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'bypass' },
            { name: 'url', type: 'string', required: true, description: 'URL para bypass' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=bypass&url=https://example.com&apikey=SUA_API_KEY"'
    },
    {
        id: 'bypasscf',
        name: 'Bypass Cloudflare',
        icon: 'fa-shield-virus',
        description: 'Bypass de proteção CF',
        method: 'GET',
        url: '/api/consultas?tipo=bypasscf&url={url}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'bypasscf' },
            { name: 'url', type: 'string', required: true, description: 'URL protegida por Cloudflare' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=bypasscf&url=https://example.com&apikey=SUA_API_KEY"'
    },
    {
        id: 'infoff',
        name: 'Free Fire Info',
        icon: 'fa-gamepad',
        description: 'Informações de conta Free Fire',
        method: 'GET',
        url: '/api/consultas?tipo=infoff&playerid={playerid}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'infoff' },
            { name: 'playerid', type: 'string', required: true, description: 'ID do jogador Free Fire' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=infoff&playerid=123456789&apikey=SUA_API_KEY"'
    },
    {
        id: 'downloader',
        name: 'AIO Downloader',
        icon: 'fa-download',
        description: 'Download de mídias de múltiplas plataformas',
        method: 'GET',
        url: '/api/consultas?tipo=downloader&url={url}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'downloader' },
            { name: 'url', type: 'string', required: true, description: 'URL do vídeo/mídia para baixar' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=downloader&url=https://tiktok.com/video&apikey=SUA_API_KEY"'
    },
    {
        id: 'github',
        name: 'GitHub Search',
        icon: 'fab fa-github',
        description: 'Busca de usuários e repositórios',
        method: 'GET',
        url: '/api/consultas?tipo=github&username={username}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'github' },
            { name: 'username', type: 'string', required: true, description: 'Nome de usuário no GitHub' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=github&username=octocat&apikey=SUA_API_KEY"'
    },
    {
        id: 'gimage',
        name: 'Google Images',
        icon: 'fab fa-google',
        description: 'Busca de imagens',
        method: 'GET',
        url: '/api/consultas?tipo=gimage&q={query}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'gimage' },
            { name: 'q', type: 'string', required: true, description: 'Termo de busca' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=gimage&q=cats&apikey=SUA_API_KEY"'
    },
    {
        id: 'pinterest',
        name: 'Pinterest Search',
        icon: 'fab fa-pinterest',
        description: 'Busca de pins e boards',
        method: 'GET',
        url: '/api/consultas?tipo=pinterest&q={query}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'pinterest' },
            { name: 'q', type: 'string', required: true, description: 'Termo de busca' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=pinterest&q=food&apikey=SUA_API_KEY"'
    },
    {
        id: 'roblox',
        name: 'Roblox Stalk',
        icon: 'fas fa-cube',
        description: 'Informações de usuários Roblox',
        method: 'GET',
        url: '/api/consultas?tipo=roblox&username={username}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'roblox' },
            { name: 'username', type: 'string', required: true, description: 'Nome de usuário Roblox' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=roblox&username=Player&apikey=SUA_API_KEY"'
    },
    {
        id: 'tiktok',
        name: 'TikTok Search',
        icon: 'fab fa-tiktok',
        description: 'Busca de perfis e vídeos TikTok',
        method: 'GET',
        url: '/api/consultas?tipo=tiktok&username={username}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'tiktok' },
            { name: 'username', type: 'string', required: true, description: 'Nome de usuário TikTok' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=tiktok&username=@tiktok&apikey=SUA_API_KEY"'
    },
    {
        id: 'yt',
        name: 'YouTube Search',
        icon: 'fab fa-youtube',
        description: 'Busca de vídeos no YouTube',
        method: 'GET',
        url: '/api/consultas?tipo=yt&q={query}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'yt' },
            { name: 'q', type: 'string', required: true, description: 'Termo de busca' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=yt&q=music&apikey=SUA_API_KEY"'
    },
    {
        id: 'video',
        name: 'Text to Video',
        icon: 'fas fa-video',
        description: 'Geração de vídeos a partir de texto',
        method: 'GET',
        url: '/api/consultas?tipo=video&prompt={prompt}&quality={quality}&ratio={ratio}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'video' },
            { name: 'prompt', type: 'string', required: true, description: 'Texto prompt para gerar vídeo' },
            { name: 'quality', type: 'string', required: false, value: '1080p', description: 'Qualidade do vídeo' },
            { name: 'ratio', type: 'string', required: false, value: '9:16', description: 'Proporção do vídeo' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=video&prompt=a+cat+dancing&quality=1080p&ratio=9:16&apikey=SUA_API_KEY"'
    },
    {
        id: 'nsfw',
        name: 'NSFW Generator',
        icon: 'fas fa-image',
        description: 'Geração de imagens NSFW',
        method: 'GET',
        url: '/api/consultas?tipo=nsfw&prompt={prompt}&apikey={apikey}',
        params: [
            { name: 'tipo', type: 'string', required: true, value: 'nsfw' },
            { name: 'prompt', type: 'string', required: true, description: 'Texto prompt para gerar imagem' },
            { name: 'apikey', type: 'string', required: true, description: 'Sua API Key' }
        ],
        example: 'curl "http://localhost:8080/api/consultas?tipo=nsfw&prompt=a+beautiful+woman&apikey=SUA_API_KEY"'
    }
];

// Variáveis globais
let savedApiKey = localStorage.getItem('mutanox_api_key') || '';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Carregar API Key salva
    if (savedApiKey) {
        document.getElementById('api-key-input').value = savedApiKey;
        document.getElementById('auth-api-key').value = savedApiKey;
    }

    // Renderizar endpoints
    renderEndpoints();
});

// Salvar API Key
window.saveApiKey = function() {
    var apiKeyInput = document.getElementById('api-key-input');
    var apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        alert('Por favor, digite sua API Key!');
        return;
    }

    // Salvar no localStorage
    localStorage.setItem('mutanox_api_key', apiKey);
    savedApiKey = apiKey;

    // Atualizar input de autenticação
    document.getElementById('auth-api-key').value = apiKey;

    alert('API Key salva com sucesso!');
};

// Autenticar
window.authenticate = function() {
    var authInput = document.getElementById('auth-api-key');
    var apiKey = authInput.value.trim();

    if (!apiKey) {
        alert('Por favor, digite sua API Key!');
        return;
    }

    // Salvar no localStorage
    localStorage.setItem('mutanox_api_key', apiKey);
    savedApiKey = apiKey;

    // Mostrar status de sucesso
    var authStatus = document.getElementById('auth-status');
    authStatus.style.display = 'block';
    authStatus.innerHTML = '<p style="color: #10b981; font-weight: 700; display: flex; align-items: center; gap: 8px;"><i class="fas fa-check-circle"></i> API Key salva com sucesso!</p>';

    // Ocultar após 3 segundos
    setTimeout(function() {
        authStatus.style.display = 'none';
    }, 3000);

    // Recarregar página para atualizar todos os cards
    setTimeout(function() {
        location.reload();
    }, 1000);
};

// Renderizar endpoints
function renderEndpoints() {
    var grid = document.getElementById('endpoints-grid');

    if (!grid) return;

    grid.innerHTML = userEndpoints.map(function(endpoint) {
        var paramsHTML = endpoint.params.map(function(param) {
            return '<div class="param-item">' +
                '<span class="param-name">' + param.name + '</span>' +
                '<span class="param-type">' + param.type + (param.required ? ' (obrigatório)' : '') + '</span>' +
                '</div>';
        }).join('');

        return '<div class="endpoint-card" id="endpoint-' + endpoint.id + '">' +
            '<div class="endpoint-header">' +
                '<div class="endpoint-icon">' +
                    '<i class="' + (endpoint.icon.startsWith('fa-') ? endpoint.icon : 'fas ' + endpoint.icon) + '"></i>' +
                '</div>' +
                '<div class="endpoint-title">' +
                    '<h4>' + endpoint.name + '</h4>' +
                    '<span>GET</span>' +
                '</div>' +
            '</div>' +
            '<p class="endpoint-description">' + endpoint.description + '</p>' +
            '<span class="endpoint-method">' + endpoint.method + '</span>' +
            '<div class="endpoint-url">' + endpoint.url + '</div>' +
            '<div class="endpoint-params">' +
                '<h5>Parâmetros</h5>' +
                paramsHTML +
            '</div>' +
            '<div class="endpoint-test">' +
                '<h5><i class="fas fa-flask"></i> Testar Endpoint</h5>' +
                '<div class="test-form" id="test-form-' + endpoint.id + '">' +
                    createTestInputs(endpoint) +
                '</div>' +
                '<button class="test-button" onclick="testEndpoint(\'' + endpoint.id + '\')">' +
                    '<i class="fas fa-play"></i> Executar Teste' +
                '</button>' +
                '<div class="test-result" id="test-result-' + endpoint.id + '">' +
                    '<h6><i class="fas fa-code"></i> Resultado</h6>' +
                    '<pre id="test-pre-' + endpoint.id + '"></pre>' +
                '</div>' +
            '</div>' +
            '</div>';
    }).join('');
}

// Criar inputs de teste dinamicamente
function createTestInputs(endpoint) {
    var inputs = '';

    endpoint.params.forEach(function(param) {
        if (param.name !== 'tipo' && param.name !== 'apikey') {
            var placeholder = param.description || 'Digite ' + param.name.toLowerCase();
            inputs += '<input type="text" class="test-input" id="input-' + endpoint.id + '-' + param.name + '" placeholder="' + placeholder + '" />';
        }
    });

    return inputs;
}

// Testar endpoint
window.testEndpoint = async function(endpointId) {
    var apiKey = document.getElementById('auth-api-key').value.trim();

    if (!apiKey) {
        alert('Por favor, conecte sua API Key primeiro!');
        return;
    }

    // Encontrar endpoint
    var endpoint = userEndpoints.find(function(ep) { return ep.id === endpointId; });
    if (!endpoint) return;

    // Coletar parâmetros
    var url = 'http://localhost:8080/api/consultas';
    var params = '?apikey=' + apiKey;

    endpoint.params.forEach(function(param) {
        if (param.name !== 'apikey') {
            var inputValue = document.getElementById('input-' + endpointId + '-' + param.name).value.trim();
            if (inputValue) {
                params += '&' + param.name + '=' + encodeURIComponent(inputValue);
            } else if (param.required) {
                alert('Por favor, preencha o campo: ' + param.name);
                return;
            } else if (param.value) {
                params += '&' + param.name + '=' + encodeURIComponent(param.value);
            }
        }
    });

    url += params;

    // Mostrar resultado
    var resultDiv = document.getElementById('test-result-' + endpointId);
    var preElement = document.getElementById('test-pre-' + endpointId);
    var testButton = document.querySelector('#endpoint-' + endpointId + ' .test-button');

    resultDiv.classList.add('active');
    preElement.innerHTML = '<span style="color: #7c3aed;">⏳</span> Executando consulta...';
    testButton.disabled = true;
    testButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Aguardando...';

    try {
        var response = await fetch(url);
        var data = await response.json();

        // Exibir resultado
        preElement.innerHTML = '<pre style="color: #f1f5f9;">' + JSON.stringify(data, null, 2) + '</pre>';

        if (data.sucesso) {
            resultDiv.querySelector('h6').innerHTML = '<i class="fas fa-check-circle success-response"></i> Sucesso';
        } else {
            resultDiv.querySelector('h6').innerHTML = '<i class="fas fa-exclamation-circle error-response"></i> Erro';
        }
    } catch (error) {
        // Exibir erro
        preElement.innerHTML = '<pre style="color: #ef4444;">Erro: ' + error.message + '</pre>';
        resultDiv.querySelector('h6').innerHTML = '<i class="fas fa-times-circle error-response"></i> Erro de conexão';
    }

    testButton.disabled = false;
    testButton.innerHTML = '<i class="fas fa-play"></i> Executar Teste';
};
