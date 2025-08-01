import mongoose from 'mongoose';

const metodoPagoSchema = new mongoose.Schema({
    id_método: {
        type: String,
        default: ""
    },
    descripción: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

export default mongoose.model('método_pago', metodoPagoSchema, 'método_pago'); 