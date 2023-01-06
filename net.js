var net = require('net');
var moment = require('moment');
let da = new Date(new Date().toString()).toISOString();

var server = net.createServer({ keepAlive: true }, function (connection) {
    connection.setEncoding('utf8')
    console.log("start connection \n \n");

    var a = "HTTP/1.1 101 Switching Protocols\nSec-WebSocket-Protocol: ocpp1.6\nUpgrade: websocket\nConnection: Upgrade\nSec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=";
    connection.write(a);

    var arr = [];
    connection.on('data', function (d) {
        if (d) {
            let l = d.toString();
            console.log('Response : = ', l);

            var str = l.substring(l.indexOf("["));
            let j = JSON.parse(str.trim())
            if (j) {
                if (j[3].connectorId === 1) {
                    const t = {
                        "xStartCharging": {
                            "connectorId": 1,
                            "idTag": "A6DA6EF0",
                            "meterStart": 000001,
                            "timestamp": da
                        }
                    }
                    console.log('t', t);
                    connection.write(Buffer.from(JSON.stringify(t)));
                    console.log('start charging button');
                }
            }

            //const tr = JSON.parse(str.trim());


            // [3,"2",{"status":"Accepted","currentTime":"2022-12-15T06:13:10.320Z","interval":14400}]
            arr.push(j[0], j[1], { "status": "Accepted", "currentTime": da, "interval": 14400 })
            connection.write(Buffer.from(JSON.stringify(arr)));
            arr = [];
        }
    });

    connection.on('end', function () {
        console.log('client disconnected');
    });

    connection.pipe(connection)

});

server.on('error', (err) => {
    throw err;
});

server.listen(8181, function () {
    console.log('server is listening');
});

