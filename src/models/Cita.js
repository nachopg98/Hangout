const mongoose = require('mongoose');
const {Schema} = mongoose;

const CitaSchema = new Schema({
    usuarios:{ type: String, required: true},
    titulo: {type: String},
    descripcion:{type: String},
    lugar: {type: String},
    date:{type: Date},
    compañia: {type: String},
    detalles: {type: String}
});

module.exports = mongoose.model('Cita',CitaSchema);
