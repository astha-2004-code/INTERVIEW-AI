require("dotenv").config()
const http = require("http")
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const { initSocket } = require("./src/socket/socket")

connectToDB().catch(err => {
    console.error("Failed to connect to database at startup. Server will continue running, and retry on incoming requests:", err.message)
})

const server = http.createServer(app)
initSocket(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`)
})