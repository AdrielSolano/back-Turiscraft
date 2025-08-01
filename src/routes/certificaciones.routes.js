import { Router } from 'express';
import { 
    getCertificaciones, 
    getCertificacionById, 
    createCertificacion, 
    updateCertificacion, 
    deleteCertificacion 
} from '../controllers/certificaciones.controller.js';

const router = Router();

// Rutas de certificaciones
router.get('/', getCertificaciones);
router.get('/:id', getCertificacionById);
router.post('/', createCertificacion);
router.put('/:id', updateCertificacion);
router.delete('/:id', deleteCertificacion);

export default router; 