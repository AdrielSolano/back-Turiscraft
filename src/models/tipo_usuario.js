import mongoose from 'mongoose';

const tipoUsuarioSchema = new mongoose.Schema({
    id_tipo: {
        type: String,
        default: ""
    },
    nombre_tipo: {
        type: String,
        default: ""
    },
    descripción: {
        type: String,
        default: ""
    },
    estatus: {
        type: Boolean,
        default: true
    },
    tipo_persona: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model('tipo_usuario', tipoUsuarioSchema, 'tipo_usuario'); 