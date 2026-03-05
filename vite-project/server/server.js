import { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  return res.end("Server starts");
});
const wss = new WebSocketServer({ server });
// const ws = new WebSocket("ws://localhost:8080");

wss.on("connection", (ws) => {
  console.log("Client Connected");

  ws.on("message", (data) => {
    let parsed;
    try {
      parsed = JSON.parse(data.toString());
    } catch (err) {
      console.log(err);
      return;
    }
    const outbound = JSON.stringify(parsed);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) client.send(outbound);
    });
  });
  ws.on("close", () => {
    console.log("Client Disconnected");
  });
  ws.on("error", (err) => {
    console.log(err);
  });
});

server.listen(8080, () => {
  console.log("Server is running at http://localhost:8080");
});
