const mongoose = require("mongoose")



async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (mongoose.connection.readyState === 2) {
        return new Promise((resolve, reject) => {
            mongoose.connection.once("connected", () => resolve(mongoose.connection));
            mongoose.connection.once("error", reject);
        });
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI environment variable is missing");
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        })

        console.log("Connected to Database")
        return mongoose.connection;
    }
    catch (err) {
        console.error("Database connection error:", err)
        throw err;
    }
}

module.exports = connectToDB