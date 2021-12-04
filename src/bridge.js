var osc = require("osc")

let server = require('ws').Server;
let srv = new server({port: 9000, 'Access-Control-Allow-Origin': "*"});
srv.on('connection', ws => {
  ws.on('message', msg => {
    console.log(`Received message => ${msg}`)
    udpPort.send({
        address: "/s_new",
        args: [msg]
    }, '127.0.0.1', 57110);
  })
  ws.send('hey')
});

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121
});
 
// Listen for incoming OSC bundles.
udpPort.on("bundle", function (oscBundle) {
    console.log("An OSC bundle just arrived!", oscBundle);
});
 
// Open the socket.
udpPort.open();
 
// Send an OSC message to, say, SuperCollider
