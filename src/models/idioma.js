import mongoose from 'mongoose';

const idiomaSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  nombre: { type: String, required: true }
});

export default mongoose.model('idioma', idiomaSchema, 'idiomas'); 