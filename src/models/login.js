import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  tipo_persona: { type: String, enum: ['usuario', 'guia', 'desconocido'], default: 'desconocido' },
  exito: { type: Boolean, required: true },
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model('login', loginSchema, 'login'); 