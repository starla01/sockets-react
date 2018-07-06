const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

// our localhost port
const port = 4001;
const app = express();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('New client connected')
        // just like on the client side, we have a socket.on method that takes a callback function
        // socket.on('change color', (color) => {
        //     // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
        //     // we make use of the socket.emit method again with the argument given to use from the callback function above
        //     console.log('Color Changed to: ', color)
        //     io.sockets.emit('change color', color)
        // })
    socket.on('chat', (msg) => {
        console.log(msg)
        io.sockets.emit('chat', msg)
    })

    socket.on('ID person', (IDPerson) => {
        console.log(IDPerson)
        io.sockets.emit('ID person', IDPerson)
    })

    socket.on('change color', (color) => {
            console.log(color)
            io.sockets.emit('change color', color)
        })
        // disconnect is fired when a client leaves the server
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))