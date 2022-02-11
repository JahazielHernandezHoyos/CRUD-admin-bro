const mongoose = require("mongoose")

const PostBlog = new mongoose.Schema({
    titulo: {type: String, required: true},
    contenido: {type: String, required: true},
    autor: {type: String, required: true},
    fecha: Date,
    imagen: String,
    categoria: String,
    estado: String,
    creado: Date,
    modificado: Date
})

module.exports = mongoose.model("Post", PostBlog)