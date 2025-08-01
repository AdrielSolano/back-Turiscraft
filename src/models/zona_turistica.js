import mongoose from 'mongoose';

const zonaTuristicaSchema = new mongoose.Schema({
    id_lugar: {
        type: String,
        default: ""
    },
    nombre: {
        type: String,
        default: ""
    },
    descripción: {
        type: String,
        default: ""
    },
    id_ubicación: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ubicación'
    },
    id_categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria'
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    },
    estatus: {
        type: Boolean,
        default: true
    },
    imagen_principal: {
        url: {
            type: String,
            default: "/img/ubicacion.jpg"
        },
        alt_text: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: { 
        createdAt: 'create_at', 
        updatedAt: 'update_at' 
    }
});

export default mongoose.model('zona_turistica', zonaTuristicaSchema, 'zona_turistica');
