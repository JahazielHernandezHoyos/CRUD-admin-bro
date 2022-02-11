const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    password: String,
    role: { type: String, enum: ['admin', 'restricted'], required: true },
    estado: String,
    creado: Date,
    modificado: Date
})

module.exports = mongoose.model("User", UserSchema)