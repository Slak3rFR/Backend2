const express = require('express');
const { engine } = require('express-handlebars');
const { Server } = require('socket.io');
const path = require('path');
const connectDB = require('./config/db'); // Importa la función
const { port } = require('./config/env');
const Product = require('./models/Product');
const usersRouter = require('./routes/users');
const sessionsRouter = require('./routes/sessions');
require('./passport');

const app = express();

// Conectar a MongoDB de forma asíncrona
(async () => {
    try {
        await connectDB(); // Llama a la función asíncrona
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
})();

// Configurar Handlebars
app.engine('handlebars', engine({
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    extname: '.handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar servidor
const server = app.listen(port || 8080, () => {
    console.log(`Server running on port ${port || 8080}`);
});

// Configurar Socket.io
const io = new Server(server);

// Rutas (requeridas después de inicializar io)
const productsRouter = require('./routes/products')(io); // Pasa io aquí
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

// Ruta protegida /realtimeproducts
app.get('/realtimeproducts', require('./passport').authMiddleware, async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error loading realtime products');
    }
});

// Configurar eventos de Socket.io
io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const products = await Product.find().lean();
    socket.emit('updateProducts', products);
    socket.on('addProduct', async (product) => {
        try {
            if (!product.title || !product.description || !product.code || !product.price || product.status === undefined || !product.stock || !product.category) {
                throw new Error('Missing required fields');
            }
            if (product.price < 0 || product.stock < 0) {
                throw new Error('Price and stock cannot be negative');
            }
            const newProduct = await Product.create(product);
            const products = await Product.find().lean();
            io.emit('updateProducts', products);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });
    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const products = await Product.find().lean();
            io.emit('updateProducts', products);
        } catch (error) {
            socket.emit('error', 'Error al eliminar producto');
        }
    });
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});