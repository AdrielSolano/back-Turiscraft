import mongoose from 'mongoose';

const guiaSchema = new mongoose.Schema({
    // Campos básicos (como usuario)
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
        ref: 'ubicación',
        default: null
    },
    id_tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipo_usuario',
        default: null
    },
    estatus: {
        type: Boolean,
        default: true
    },
    
    // Campos específicos de guía
    descripción: {
        type: String,
        default: ""
    },
    disponibilidad: {
        type: Boolean,
        default: true
    },
    tarifa_hora: {
        type: Number,
        default: 0
    },
    calificación: {
        type: Number,
        default: 0
    },
    certificado_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'certificaciones',
        default: null
    },
    zona_turistica_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'zona_turistica',
        default: null
    }
}, {
    timestamps: { 
        createdAt: 'create_at', 
        updatedAt: 'update_at' 
    }
});

export default mongoose.model('guia', guiaSchema, 'guia'); 