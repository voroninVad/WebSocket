const WebSocket = require('ws');
const {v4:uuidv4} = require('uuid');

const clients = {};
const mesages = [];

const wss = new WebSocket.Server({port: 8080});

wss.on('connection', (socket) => {
    const idUser = uuidv4();
    clients[idUser] = socket;
    socket.send(JSON.stringify([{idUser:null, message:'Добро пожаловать в чат!'}]));
    socket.send(JSON.stringify(mesages));
    console.log(`новое подключение: ${idUser}`);
    socket.on('message', (data) =>{
        const {userId, message} = JSON.parse(data)
        mesages.push({userId, message})
        for(const idUser in clients){
            clients[idUser].send(JSON.stringify([{userId, message}]))
        }
    })
    socket.on('close', () => {
        console.log(`Клиент отключился: ${idUser}`);
    });
});
console.log('сервер запущен')