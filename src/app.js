import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv/config';
import connectDB from './connection/db.js';
import cookieParser from 'cookie-parser';

// Importar todos los modelos para que Mongoose los registre
import './models/usuario.js';
import './models/tipo_usuario.js';
import './models/zona_turistica.js';
import './models/reservas.js';
import './models/guia.js';
import './models/moneda.js';
import './models/metodo_pago.js';
import './models/restaurantes.js';
import './models/certificaciones.js';
import './models/categoria.js';
import './models/ubicacion.js';
import './models/anuncios.js';
import './models/resenas.js';
import authRoutes from './routes/auth.js';
import smartAuthRoutes from './routes/smart-auth.js';
import zonaTuristicaRoutes from './routes/zona_turistica.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import ubicacionRoutes from './routes/ubicacion.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import monedaRoutes from './routes/moneda.routes.js';
import metodoPagoRoutes from './routes/metodo_pago.routes.js';
import restaurantesRoutes from './routes/restaurantes.routes.js';
import certificacionesRoutes from './routes/certificaciones.routes.js';
import anunciosRoutes from './routes/anuncios.routes.js';
import resenasRoutes from './routes/resenas.routes.js';
import dbInfoRoutes from './routes/db-info.js';
import idiomaRoutes from './routes/idioma.routes.js';

connectDB(); 
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Configurar CORS para permitir cookies
app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/smart-auth', smartAuthRoutes);
app.use('/api/zonas-turisticas', zonaTuristicaRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/ubicacion', ubicacionRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/moneda', monedaRoutes);
app.use('/api/metodo-pago', metodoPagoRoutes);
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/certificaciones', certificacionesRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/resenas', resenasRoutes);
app.use('/api/db-info', dbInfoRoutes);
app.use('/api/idiomas', idiomaRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'TourCraft API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
    });
});

export default app;