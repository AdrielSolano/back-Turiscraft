import mongoose from 'mongoose';

const anuncioSchema = new mongoose.Schema({
    id_anuncio: {
        type: String,
        default: ""
    },
    titulo: {
        type: String,
        default: ""
    },
    descripción: {
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: ""
    },
    fecha_inicio: {
        type: Date,
        default: Date.now
    },
    fecha_fin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { 
        createdAt: 'create_at', 
        updatedAt: 'update_at' 
    }
});

export default mongoose.model('anuncio', anuncioSchema, 'anuncio'); 