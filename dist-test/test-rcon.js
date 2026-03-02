import 'dotenv/config';
import net from 'node:net';
console.log('Script démarré');
async function testConnection(host, port) {
    console.log('Entrée dans testConnection');
    return new Promise((resolve) => {
        console.log(`Test TCP basique vers ${host}:${port}...`);
        const socket = new net.Socket();
        const timeout = 5000;
        socket.setTimeout(timeout);
        socket.on('connect', () => {
            console.log('TCP Connecté !');
            socket.destroy();
            resolve(true);
        });
        socket.on('error', (err) => {
            console.error('TCP Erreur :', err.message);
            resolve(false);
        });
        socket.on('timeout', () => {
            console.error('TCP Timeout !');
            socket.destroy();
            resolve(false);
        });
        socket.connect(port, host);
    });
}
async function testRcon() {
    const host = process.env.RCON_HOST || 'localhost';
    const portString = process.env.RCON_PORT;
    const port = parseInt(portString || '25575', 10);
    console.log('Variables ENV lues :', { host, portString, port });
    const tcpSuccess = await testConnection(host, port);
    if (!tcpSuccess) {
        console.error("Impossible d'établir une connexion TCP basique. Inutile d'essayer le RCON.");
        return;
    }
    console.log(`Tentative de connexion RCON à ${host}:${port}... (SIMULÉE)`);
}
testRcon();
