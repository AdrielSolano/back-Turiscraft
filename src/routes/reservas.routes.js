import express from 'express';
import { 
    getReservas, 
    getReservasByUser,
    getReservaById, 
    createReserva, 
    updateReserva, 
    cancelarReserva,
    calificarReserva
} from '../controllers/reservas.controller.js';
import { validateToken } from '../middlewares/validateToken.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(validateToken);

// Rutas de reservas
router.get('/', getReservas);
router.get('/usuario/:userId', getReservasByUser);
router.post('/', createReserva);
router.get('/:id', getReservaById);
router.put('/:id', updateReserva);
router.post('/:id/cancelar', cancelarReserva);
router.post('/:id/calificar', calificarReserva);

export default router; 