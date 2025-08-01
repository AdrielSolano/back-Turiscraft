import mongoose from 'mongoose';

const resenaSchema = new mongoose.Schema({
    calificación: {
        type: Number,
        default: 0
    },
    descripción: {
        type: String,
        default: ""
    },
    titulo: {
        type: String,
        default: ""
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        default: null
    },
    guia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'guia',
        default: null
    }
}, {
    timestamps: { 
        createdAt: 'create_at', 
        updatedAt: 'update_at' 
    }
});

export default mongoose.model('reseña', resenaSchema, 'reseña'); 