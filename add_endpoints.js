const fs = require('fs');
const path = require('path');
const CONFIG_FILE = path.join(__dirname, 'endpoints_config.json');

// Ler configuração atual
const endpointsConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));

// Adicionar endpoints faltantes
const newEndpoints = {
    'clima': {
        name: 'Clima Tempo',
        description: 'Previsão do tempo',
        maintenance: false
    },
    'cotacao': {
        name: 'Cotação Moedas',
        description: 'Cotação em tempo real',
        maintenance: false
    }
};

// Fundir
const updatedConfig = { ...endpointsConfig, ...newEndpoints };

// Salvar
fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));

console.log('Endpoints adicionados:', Object.keys(newEndpoints).length);
console.log('Total de endpoints:', Object.keys(updatedConfig).length);
