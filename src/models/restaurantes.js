import mongoose from 'mongoose';

const restauranteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        default: ""
    },
    descripción: {
        type: String,
        default: ""
    },
    ubicación: {
        type: String,
        default: ""
    },
    precio_promedio: {
        type: Number,
        default: 0
    },
    horario: {
        type: String,
        default: ""
    },
    estatus: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('restaurantes', restauranteSchema, 'restaurantes'); 