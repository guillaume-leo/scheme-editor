import WebSocket from 'tauri-plugin-websocket-api'
import store from '@/store'
import { consoleMutations } from '@/store/console/mutations';
let ws:any

export const WSconnect = async () => {
    store.commit(consoleMutations.PRINT,'waiting for connection...');
    ws = await WebSocket.connect('ws://localhost:9001').then(r => {
        store.commit(consoleMutations.PRINT,'WebSocket connected on port 9001');
        _updateResponse('WebSocket connected on port 9001')
        return r
    }).catch(_updateResponse)
    ws.addListener(_updateResponse)
}

export function _updateResponse(returnValue:string) {
    console.log(returnValue);
}

export function WSsend(text:string) {
    console.log(text);
    ws.send(text).then(() => {
        store.commit(consoleMutations.PRINT,text);
    }).catch(_updateResponse)
}

export function disconnect() {
    ws.disconnect().then(() => _updateResponse('Disconnected')).catch(_updateResponse)
}