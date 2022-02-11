const mongoose = require("mongoose")

const User = new mongoose.Schema({email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true },modificado: Date
})

module.exports = mongoose.model("User", User)