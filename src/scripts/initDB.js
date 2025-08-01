import connectDB from '../connection/db.js';
import TipoRoll from '../models/tipo_roll.js';
import Ubicacion from '../models/ubicacion.js';
import Categoria from '../models/categoria.js';
import ZonaTuristica from '../models/zona_turistica.js';
import TipoUsuario from '../models/tipo_usuario.js';

const initDatabase = async () => {
    try {
        await connectDB();
        
        console.log('Inicializando base de datos...');
        
        // Crear tipos de roll
        const tiposRoll = [
            {
                nombre: 'usuario',
                descripcion: 'Usuario regular que puede hacer reservas',
                permisos: ['ver_zonas', 'hacer_reservas', 'calificar_tours'],
                activo: true
            },
            {
                nombre: 'guias',
                descripcion: 'Guía turístico que puede gestionar tours',
                permisos: ['ver_zonas', 'hacer_reservas', 'calificar_tours', 'gestionar_tours', 'ver_reservas'],
                activo: true
            }
        ];
        
        console.log('Creando tipos de roll...');
        for (const tipoRoll of tiposRoll) {
            const existe = await TipoRoll.findOne({ nombre: tipoRoll.nombre });
            if (!existe) {
                await TipoRoll.create(tipoRoll);
                console.log(`Tipo de roll "${tipoRoll.nombre}" creado`);
            }
        }
        
        // Crear tipos de usuario si no existen
        const tiposUsuario = [
            {
                id_tipo: "USR001",
                nombre_tipo: "Usuario Regular",
                descripción: "Usuario regular de la plataforma",
                tipo_persona: "usuario",
                estatus: true
            },
            {
                id_tipo: "GUI001", 
                nombre_tipo: "Guía Turístico",
                descripción: "Guía turístico certificado",
                tipo_persona: "guia",
                estatus: true
            }
        ];

        for (const tipo of tiposUsuario) {
            const existingTipo = await TipoUsuario.findOne({ tipo_persona: tipo.tipo_persona });
            if (!existingTipo) {
                await TipoUsuario.create(tipo);
                console.log(`Tipo de usuario "${tipo.nombre_tipo}" creado`);
            } else {
                console.log(`Tipo de usuario "${tipo.nombre_tipo}" ya existe`);
            }
        }
        
        // Crear categorías de ejemplo
        const categorias = [
            {
                nombre: 'Aventura',
                descripcion: 'Tours de aventura y actividades al aire libre',
                icono: '🏔️',
                color: '#ff6b35'
            },
            {
                nombre: 'Cultural',
                descripcion: 'Tours culturales y visitas históricas',
                icono: '🏛️',
                color: '#4ecdc4'
            },
            {
                nombre: 'Naturaleza',
                descripcion: 'Tours de naturaleza y ecoturismo',
                icono: '🌿',
                color: '#45b7d1'
            },
            {
                nombre: 'Gastronomía',
                descripcion: 'Tours gastronómicos y experiencias culinarias',
                icono: '🍽️',
                color: '#f7b731'
            },
            {
                nombre: 'Playa',
                descripcion: 'Tours de playa y actividades acuáticas',
                icono: '🏖️',
                color: '#26de81'
            }
        ];
        
        console.log('Creando categorías...');
        for (const categoria of categorias) {
            const existe = await Categoria.findOne({ nombre: categoria.nombre });
            if (!existe) {
                await Categoria.create(categoria);
                console.log(`Categoría "${categoria.nombre}" creada`);
            }
        }
        
        // Crear ubicaciones de ejemplo
        const ubicaciones = [
            {
                nombre: 'Centro Histórico de la Ciudad',
                direccion: 'Plaza Mayor 123',
                ciudad: 'Ciudad de México',
                estado: 'CDMX',
                codigoPostal: '06000',
                coordenadas: {
                    latitud: 19.4326,
                    longitud: -99.1332
                },
                descripcion: 'El corazón histórico de la ciudad con arquitectura colonial'
            },
            {
                nombre: 'Parque Nacional Chapultepec',
                direccion: 'Av. Paseo de la Reforma s/n',
                ciudad: 'Ciudad de México',
                estado: 'CDMX',
                codigoPostal: '11560',
                coordenadas: {
                    latitud: 19.4205,
                    longitud: -99.1866
                },
                descripcion: 'El parque urbano más grande de América Latina'
            },
            {
                nombre: 'Zona Arqueológica de Teotihuacán',
                direccion: 'Carretera México-Pachuca km 46',
                ciudad: 'San Juan Teotihuacán',
                estado: 'Estado de México',
                codigoPostal: '55800',
                coordenadas: {
                    latitud: 19.6925,
                    longitud: -98.8439
                },
                descripcion: 'Antigua ciudad prehispánica con las pirámides del Sol y la Luna'
            },
            {
                nombre: 'Playa del Carmen',
                direccion: 'Av. 5 Norte s/n',
                ciudad: 'Playa del Carmen',
                estado: 'Quintana Roo',
                codigoPostal: '77710',
                coordenadas: {
                    latitud: 20.6296,
                    longitud: -87.0739
                },
                descripcion: 'Hermosa playa del Caribe mexicano'
            },
            {
                nombre: 'Barrio de Coyoacán',
                direccion: 'Centro de Coyoacán',
                ciudad: 'Ciudad de México',
                estado: 'CDMX',
                codigoPostal: '04000',
                coordenadas: {
                    latitud: 19.3550,
                    longitud: -99.1626
                },
                descripcion: 'Barrio bohemio con calles empedradas y casas coloniales'
            }
        ];
        
        console.log('Creando ubicaciones...');
        for (const ubicacion of ubicaciones) {
            const existe = await Ubicacion.findOne({ nombre: ubicacion.nombre });
            if (!existe) {
                await Ubicacion.create(ubicacion);
                console.log(`Ubicación "${ubicacion.nombre}" creada`);
            }
        }
        
        // Obtener IDs de categorías y ubicaciones
        const categoriaAventura = await Categoria.findOne({ nombre: 'Aventura' });
        const categoriaCultural = await Categoria.findOne({ nombre: 'Cultural' });
        const categoriaNaturaleza = await Categoria.findOne({ nombre: 'Naturaleza' });
        const categoriaGastronomia = await Categoria.findOne({ nombre: 'Gastronomía' });
        const categoriaPlaya = await Categoria.findOne({ nombre: 'Playa' });
        
        const ubicacionCentro = await Ubicacion.findOne({ nombre: 'Centro Histórico de la Ciudad' });
        const ubicacionChapultepec = await Ubicacion.findOne({ nombre: 'Parque Nacional Chapultepec' });
        const ubicacionTeotihuacan = await Ubicacion.findOne({ nombre: 'Zona Arqueológica de Teotihuacán' });
        const ubicacionPlaya = await Ubicacion.findOne({ nombre: 'Playa del Carmen' });
        const ubicacionCoyoacan = await Ubicacion.findOne({ nombre: 'Barrio de Coyoacán' });
        
        // Crear zonas turísticas de ejemplo
        const zonasTuristicas = [
            {
                nombre: 'Tour del Centro Histórico',
                descripcion: 'Recorre los lugares más emblemáticos del centro histórico de la Ciudad de México, incluyendo la Catedral Metropolitana, el Palacio Nacional y el Templo Mayor.',
                id_ubicacion: ubicacionCentro._id,
                id_categoria: categoriaCultural._id,
                precio: 800,
                capacidad: 20,
                duracion: 3,
                imagenes: [
                    'https://example.com/centro1.jpg',
                    'https://example.com/centro2.jpg'
                ],
                horarios: {
                    apertura: '09:00',
                    cierre: '18:00'
                },
                diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                serviciosIncluidos: ['Guía certificado', 'Entrada a museos', 'Refrigerio'],
                requisitos: ['Ropa cómoda', 'Zapatos cerrados', 'Documento de identidad']
            },
            {
                nombre: 'Aventura en Chapultepec',
                descripcion: 'Explora el bosque de Chapultepec con actividades de aventura como tirolesa, escalada y senderismo.',
                id_ubicacion: ubicacionChapultepec._id,
                id_categoria: categoriaAventura._id,
                precio: 1200,
                capacidad: 15,
                duracion: 4,
                imagenes: [
                    'https://example.com/chapultepec1.jpg',
                    'https://example.com/chapultepec2.jpg'
                ],
                horarios: {
                    apertura: '08:00',
                    cierre: '17:00'
                },
                diasDisponibles: ['sabado', 'domingo'],
                serviciosIncluidos: ['Equipo de seguridad', 'Guía especializado', 'Seguro de viajero'],
                requisitos: ['Ropa deportiva', 'Zapatos de montaña', 'Edad mínima 12 años']
            },
            {
                nombre: 'Teotihuacán Místico',
                descripcion: 'Visita la zona arqueológica más importante de México y descubre los secretos de la antigua ciudad de Teotihuacán.',
                id_ubicacion: ubicacionTeotihuacan._id,
                id_categoria: categoriaCultural._id,
                precio: 1500,
                capacidad: 25,
                duracion: 6,
                imagenes: [
                    'https://example.com/teotihuacan1.jpg',
                    'https://example.com/teotihuacan2.jpg'
                ],
                horarios: {
                    apertura: '07:00',
                    cierre: '16:00'
                },
                diasDisponibles: ['martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                serviciosIncluidos: ['Transporte desde CDMX', 'Guía arqueólogo', 'Comida tradicional'],
                requisitos: ['Ropa cómoda', 'Protector solar', 'Agua']
            },
            {
                nombre: 'Gastronomía de Coyoacán',
                descripcion: 'Descubre los sabores tradicionales de México en el barrio bohemio de Coyoacán, visitando mercados y restaurantes locales.',
                id_ubicacion: ubicacionCoyoacan._id,
                id_categoria: categoriaGastronomia._id,
                precio: 900,
                capacidad: 12,
                duracion: 3.5,
                imagenes: [
                    'https://example.com/coyoacan1.jpg',
                    'https://example.com/coyoacan2.jpg'
                ],
                horarios: {
                    apertura: '10:00',
                    cierre: '19:00'
                },
                diasDisponibles: ['miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                serviciosIncluidos: ['Degustaciones', 'Guía gastronómico', 'Recetario'],
                requisitos: ['Apetito', 'Ropa casual', 'Cámara fotográfica']
            },
            {
                nombre: 'Playa del Carmen Paradise',
                descripcion: 'Disfruta de las hermosas playas del Caribe mexicano con actividades acuáticas y relajación.',
                id_ubicacion: ubicacionPlaya._id,
                id_categoria: categoriaPlaya._id,
                precio: 2000,
                capacidad: 18,
                duracion: 8,
                imagenes: [
                    'https://example.com/playa1.jpg',
                    'https://example.com/playa2.jpg'
                ],
                horarios: {
                    apertura: '08:00',
                    cierre: '18:00'
                },
                diasDisponibles: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'],
                serviciosIncluidos: ['Transporte desde Cancún', 'Equipo de snorkel', 'Almuerzo en la playa'],
                requisitos: ['Traje de baño', 'Protector solar', 'Toalla']
            }
        ];
        
        console.log('Creando zonas turísticas...');
        for (const zonaTuristica of zonasTuristicas) {
            const existe = await ZonaTuristica.findOne({ nombre: zonaTuristica.nombre });
            if (!existe) {
                await ZonaTuristica.create(zonaTuristica);
                console.log(`Zona turística "${zonaTuristica.nombre}" creada`);
            }
        }
        
        console.log('✅ Base de datos inicializada exitosamente');
        console.log('\n📋 Información importante:');
        console.log('- Tipos de roll creados: usuario, guias');
        console.log('- Para registrar usuarios, necesitas el ID del tipo de roll');
        console.log('- Ejemplo de registro:');
        console.log('  POST /api/auth/register');
        console.log('  {');
        console.log('    "username": "usuario1",');
        console.log('    "email": "usuario@example.com",');
        console.log('    "password": "password123",');
        console.log('    "id_tipo_roll": "ID_DEL_TIPO_ROLL"');
        console.log('  }');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

initDatabase(); 