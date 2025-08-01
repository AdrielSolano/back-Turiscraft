import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    console.log('=== MIDDLEWARE AUTH REQUIRED ===');
    console.log('URL de la petición:', req.url);
    console.log('Método de la petición:', req.method);
    console.log('Headers completos:', req.headers);
    console.log('Cookies recibidas:', req.cookies);
    console.log('Cookie token:', req.cookies?.token);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Origin:', req.headers.origin);
    console.log('Referer:', req.headers.referer);
    
    const { token } = req.cookies;
    
    if(!token) {
        console.log('❌ ERROR: No se encontró token en las cookies');
        console.log('Cookies disponibles:', Object.keys(req.cookies));
        return res.status(401).json({ 
            success: false, 
            message: 'Acceso denegado, no se proporcionó token',
            debug: {
                cookies: req.cookies,
                headers: req.headers
            }
        });
    }
    
    console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
    console.log('Longitud del token:', token.length);
    
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log('❌ ERROR verificando token:', err.message);
            console.log('Tipo de error:', err.name);
            console.log('Token expirado:', err.name === 'TokenExpiredError');
            console.log('Token malformado:', err.name === 'JsonWebTokenError');
            return res.status(403).json({ 
                success: false, 
                message: "Token inválido",
                debug: {
                    error: err.message,
                    errorType: err.name
                }
            });
        }
        
        console.log('✅ Token válido, usuario decodificado:', user);
        console.log('ID del usuario:', user.id);
        console.log('Tipo de persona:', user.tipo_persona);
        console.log('Es guía:', user.isGuia);
        
        req.user = user;
        next();
    });
};

// Alias para mantener compatibilidad
export const validateToken = authRequired;

// Middleware para validar roles específicos
export const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado, autenticación requerida'
            });
        }

        if (!req.user.tipoRoll) {
            return res.status(403).json({
                success: false,
                message: 'Rol no definido en el token'
            });
        }

        if (!allowedRoles.includes(req.user.tipoRoll)) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado, permisos insuficientes'
            });
        }

        next();
    };
};

// Middleware específico para guías
export const validateGuia = validateRole(['guias']);

// Middleware específico para usuarios
export const validateUsuario = validateRole(['usuario']);

// Middleware para cualquier rol autenticado
export const validateAnyRole = validateRole(['guias', 'usuario']);