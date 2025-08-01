import mongoose from 'mongoose';

const ubicacionSchema = new mongoose.Schema({
    id_ubicación: {
        type: String,
        default: ""
    },
    país: {
        type: String,
        default: ""
    },
    ciudad: {
        type: String,
        default: ""
    },
    código_postal: {
        type: String,
        default: ""
    },
    adress: {
        calle: {
            type: String,
            default: ""
        },
        número: {
            type: String,
            default: ""
        },
        colonia: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('ubicación', ubicacionSchema, 'ubicación'); 