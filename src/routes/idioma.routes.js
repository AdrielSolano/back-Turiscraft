import { Router } from 'express';
import Idioma from '../models/idioma.js';

const router = Router();

// GET /api/idiomas
router.get('/', async (req, res) => {
  try {
    const idiomas = await Idioma.find();
    res.json(idiomas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener idiomas' });
  }
});

export default router; 