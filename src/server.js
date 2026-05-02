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
app.get('/profile', (req, res) => res.render('profile'));

// Página 403
app.get('/403', (req, res) => {
    res.status(403).render('403');
});

// Página 404 (siempre al final)
app.use((req, res) => {
    res.status(404).render('404');
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