const mongoose = require("mongoose")

const PostBlog = new mongoose.Schema({
    titulo: {type: String, required: true},
    contenido: {type: String, required: true},
})

module.exports = mongoose.model("Blog", PostBlog)