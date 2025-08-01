import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    id_usuario: {
        type: String,
        default: ""
    },
    nombre: {
        type: String,
        default: ""
    },
    apellido_materno: {
        type: String,
        default: ""
    },
    apellido_paterno: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    telefono: {
        type: String,
        default: ""
    },
    edad: {
        type: Number,
        default: 0
    },
    id_ubicación: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ubicación'
    },
    id_tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo_usuario'
    },
    estatus: {
        type: Boolean,
        default: true
    },
    create_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    update_id: {
        type: mongoose.Schema.Types.ObjectId
    }
}, {
    timestamps: true
});

export default mongoose.model('usuario', usuarioSchema, 'usuario'); 