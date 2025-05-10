const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./config/mongoose-connection');
const clientRouter = require('./routes/clientsRouter');
const eventRouter = require('./routes/eventsRouter');
const index = require('./routes/index');
const http = require('http')
const WebSocket = require('ws');
const url = require('url');
const server = http.createServer(app); // Needed for both HTTP + WS
const wss = new WebSocket.Server({ noServer: true });
const ViewerCount = require('./models/viewer-count')
const cors = require('cors');
app.use(cors());
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


const expressSession = require("express-session");

const flash = require("connect-flash");

app.use(
  expressSession({
      resave: false,
      saveUninitialized: false,
      secret: process.env.JWT_KEY,
  })
);

app.use(flash());

app.use('/client', clientRouter);
app.use('/event', eventRouter);
app.use('/', index);
app.get('/sdk.js', (req, res) => {
    res.type('text/javascript');
    res.sendFile(path.join(__dirname, 'public', 'sdk.js'));
});
const clientsMap = new Map();

// Broadcast function
function broadcastViewerCount(clientId) {
    const connections = clientsMap.get(clientId) || new Set();
    const message = JSON.stringify({
        type: 'viewer_count',
        count: connections.size,
    });

    for (const ws of connections) {
        ws.send(message);
    }
}

// When a new user connects
wss.on('connection', async (ws, request, clientId) => {
    if (!clientsMap.has(clientId)) {
      clientsMap.set(clientId, new Set());
    }
  
    const connections = clientsMap.get(clientId);
    connections.add(ws);
    console.log(`Client ${clientId}: connected (${connections.size} online)`);
  
    try {
      await ViewerCount.findOneAndUpdate(
        { clientId },
        {
          $set: {
            count: connections.size,
            lastUpdated: new Date()
          }
        },
        { upsert: true }
      );
      broadcastViewerCount(clientId);
    } catch (err) {
      console.error("Error updating viewer count:", err);
    }
  
    // When a user disconnects
    ws.on('close', async () => {
      connections.delete(ws);
      console.log(`Client ${clientId}: disconnected (${connections.size} online)`);
  
      try {
        await ViewerCount.findOneAndUpdate(
          { clientId },
          {
            $set: {
              count: connections.size,
              lastUpdated: new Date()
            }
          },
          { new: true }
        );
        broadcastViewerCount(clientId);
      } catch (err) {
        console.error("Error updating viewer count:", err);
      }
  
      if (connections.size === 0) {
        clientsMap.delete(clientId);
      }
    });
  });
  


server.on('upgrade', (req, socket, head) => {
    const { query } = url.parse(req.url, true);
    const clientId = query.client_id;

    if (!clientId) {
        socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
        socket.destroy();
        return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req, clientId);
    });
});


server.listen(3000, () => {
    console.log('Server is running');

})