import WebSocket from 'tauri-plugin-websocket-api'

let ws

export const test = async () => {
    ws = await WebSocket.connect('ws://localhost:9001').then(r => {
        console.log('connected');
        _updateResponse('Connected')
        return r
    }).catch(_updateResponse)
    ws.addListener(_updateResponse)
}

export function _updateResponse(returnValue) {
    console.log(returnValue);
}

export function send(text) {
    ws.send(text).then(() => _updateResponse(text)).catch(_updateResponse)
}

export function disconnect() {
    ws.disconnect().then(() => _updateResponse('Disconnected')).catch(_updateResponse)
}