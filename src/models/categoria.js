import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
    id_categoria: {
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
    estatus: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Categoria', categoriaSchema, 'categoria'); 