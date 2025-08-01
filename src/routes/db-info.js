import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Endpoint temporal para inspeccionar la base de datos
router.get('/collections', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        
        res.json({
            success: true,
            collections: collectionNames
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener colecciones',
            error: error.message
        });
    }
});

// Endpoint para ver documentos de una colección específica
router.get('/collection/:name', async (req, res) => {
    try {
        const collectionName = req.params.name;
        const documents = await mongoose.connection.db.collection(collectionName).find({}).limit(5).toArray();
        
        res.json({
            success: true,
            collection: collectionName,
            documents: documents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener documentos',
            error: error.message
        });
    }
});

// Endpoint temporal para eliminar el índice problemático
router.delete('/fix-reservas-index', async (req, res) => {
    try {
        const collection = mongoose.connection.db.collection('reservas');
        
        // Listar todos los índices
        const indexes = await collection.indexes();
        console.log('Índices actuales:', indexes);
        
        // Eliminar el índice problemático si existe
        try {
            await collection.dropIndex('codigo_reserva_1');
            res.json({
                success: true,
                message: 'Índice codigo_reserva_1 eliminado exitosamente'
            });
        } catch (dropError) {
            res.json({
                success: false,
                message: 'No se pudo eliminar el índice',
                error: dropError.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al arreglar índices',
            error: error.message
        });
    }
});

export default router; 