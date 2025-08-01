import mongoose from 'mongoose';

const certificacionSchema = new mongoose.Schema({
    id_certificación: {
        type: String
    },
    nombre: {
        type: String
    },
    institución: {
        type: String
    },
    fecha_emisión: {
        type: Date,
        default: Date.now
    },
    fecha_expiración: {
        type: Date,
        default: Date.now
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario'
    }
}, {
    timestamps: { 
        createdAt: 'create_at', 
        updatedAt: 'update_at' 
    }
});

export default mongoose.model('certificaciones', certificacionSchema, 'certificaciones'); 