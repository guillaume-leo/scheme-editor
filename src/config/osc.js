import WebSocket from 'tauri-plugin-websocket-api'
import store from '@/store'
let ws

export const WSconnect = async () => {
    ws = await WebSocket.connect('ws://localhost:9001').then(r => {
        _updateResponse('WebSocket connected on port 9001')
        return r
    }).catch(_updateResponse)
    ws.addListener(_updateResponse)
}

export function _updateResponse(returnValue) {
    let output = typeof returnValue === 'object' ? returnValue.data : returnValue
    store.commit('console/print',output);
}

export function WSsend(text) {
    ws.send(text).then(() => _updateResponse(text)).catch(_updateResponse)
}

export function disconnect() {
    ws.disconnect().then(() => _updateResponse('Disconnected')).catch(_updateResponse)
}