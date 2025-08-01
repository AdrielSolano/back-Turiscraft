import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
    id_reserva: {
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
    },
    estado: {
        type: String,
        default: ""
    },
    cantidad_personas: {
        type: Number,
        default: 0
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    },
    id_moneda: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'moneda'
    },
    id_metodo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'método_pago'
    },
    id_ubicación: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'zona_turistica'
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    update_at: {
        type: Date,
        default: Date.now
    }
}, {
    autoIndex: false,
    timestamps: false
});

export default mongoose.model('ReservaModel', reservaSchema, 'reservas');
