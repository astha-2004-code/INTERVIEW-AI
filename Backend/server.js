require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB().catch(err => {
    console.error("Failed to connect to database at startup. Server will continue running, and retry on incoming requests:", err.message)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})