import store from '@/store'
import { consoleMutations } from '@/store/console/mutations';
let ws:any

const osc = new WebSocket("ws://127.0.0.1:9000");
osc.onopen = () => {
  setTimeout(() => {
    osc.send("CONNECTED_TO_SCHEME_EDITOR");
  }, 1000);
};

export function udpSend(text:string) {
    console.log(text);
    osc.send(text)
    store.commit(consoleMutations.PRINT,text);
}