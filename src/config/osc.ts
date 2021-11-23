import WebSocket from 'tauri-plugin-websocket-api'
import store from '@/store'
let ws:any

export const WSconnect = async () => {
    store.commit('console/print','waiting for connection...');
    ws = await WebSocket.connect('ws://localhost:9001').then(r => {
        store.commit('console/print','WebSocket connected on port 9001');
        _updateResponse('WebSocket connected on port 9001')
        return r
    }).catch(_updateResponse)
    ws.addListener(_updateResponse)
}

export function _updateResponse(returnValue:string) {
    console.log(returnValue);
}

export function WSsend(text:string) {
    ws.send(text).then(() => {
        store.commit('console/print',text);
    }).catch(_updateResponse)
}

export function disconnect() {
    ws.disconnect().then(() => _updateResponse('Disconnected')).catch(_updateResponse)
}