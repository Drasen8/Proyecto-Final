const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');


// Configuración CORS (usa solo una de estas opciones)
app.use(cors({
  origin: `http://localhost:${port}`,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser());

// Configuración del motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'views')));

const session = require('express-session');
app.set('trust proxy', 1); // Habilitar si estás detrás de un proxy (como Heroku)

app.use(session({
  secret: 'tu_clave_secreta', // pon una clave más segura en producción
  resave: false,
  saveUninitialized: true,
  cookie: {  maxAge: 1000 * 60 * 60 * 24  } // Usa true si estás en HTTPS
}));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'iniciasesion.html'));
});

app.get('/singUp', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registro.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'inicio.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const expedienteRoutes = require('./routes/expedientes'); 
app.use('/mis-expedientes', expedienteRoutes);

app.use('/expedientes', require('./routes/expedientes'));

const estadoRoutes = require('./routes/estado'); 
app.use('/estado-expediente', estadoRoutes);

app.get('/api/session', (req, res) => {
  res.json({ user: req.session.user || null });
});

app.use('/expedientes', require('./routes/archivo'));


const consultaRoutes = require('./routes/consultas');
app.use('/consulta-expediente', consultaRoutes);

const authRoutes = require(path.join(__dirname, './routes/auth'));
app.use('/', authRoutes);

// app.js (o server.js), tras `app.use(express.static('public'))`
app.use('/descargas', express.static(path.join(__dirname, 'public/descargas')));



// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});