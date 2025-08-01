import mongoose from 'mongoose';

const monedaSchema = new mongoose.Schema({
    id_moneda: {
        type: String,
        default: ""
    },
    código: {
        type: String,
        default: ""
    },
    nombre: {
        type: String,
        default: ""
    },
    símbolo: {
        type: String,
        default: ""
    },
    tasa_cambio: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model('moneda', monedaSchema, 'moneda'); 