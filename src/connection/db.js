import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Extraer el nombre de la base de datos de la cadena de conexión
        const connectionString = process.env.CONNECTION_STRING;
        const dbName = 'TourCraft'; // Usar el nombre exacto de la base de datos existente
        
        // Construir la cadena de conexión con el nombre correcto de la base de datos
        const finalConnectionString = connectionString.includes('?') 
            ? connectionString.replace(/\/([^\/\?]+)\?/, `/${dbName}?`)
            : connectionString.replace(/\/([^\/]+)$/, `/${dbName}`);
        
        const connection = await mongoose.connect(finalConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`MongoDB connected: ${connection.connection.host}, ${connection.connection.name}`);
    } catch(error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}

export default connectDB;