import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(join(__dirname, '../public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', join(__dirname, '../views'));

// Sesión
app.use(session({
    secret: 'laboratorio07',
    resave: false,
    saveUninitialized: false
}));

// =======================
// RUTAS API
// =======================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// =======================
// RUTAS FRONTEND
// =======================
app.get('/', (req, res) => res.redirect('/signin'));
app.get('/signin', (req, res) => res.render('signin'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/dashboard', (req, res) => res.render('dashboard'));

// Página 403
app.get('/403', (req, res) => {
    res.status(403).send(`
        <h1>403 - Prohibido</h1>
        <p>No tienes permisos para acceder a esta página</p>
        <a href="/signin">Volver al login</a>
    `);
});

// Página 404 (IMPORTANTE: siempre al final)
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Página no encontrada</h1>
        <p>La ruta no existe</p>
        <a href="/signin">Ir al inicio</a>
    `);
});

// =======================
// MANEJO DE ERRORES
// =======================
app.use((err, req, res, next) => {
    console.error(err);

    if (err.status === 403) {
        return res.redirect('/403');
    }

    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then(async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();

        app.listen(PORT, () =>
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });