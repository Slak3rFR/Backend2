const socket = io();

document.getElementById('addProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        status: true,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: []
    };
    socket.emit('addProduct', product);
    e.target.reset();
});

socket.on('updateProducts', (products) => {
    console.log('Productos actualizados:', products);
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.title} - $${product.price} <button onclick="socket.emit('deleteProduct', '${product._id.toString()}')">Eliminar</button>`;
        productList.appendChild(li);
    });
});

socket.on('error', (message) => {
    alert(message);
});