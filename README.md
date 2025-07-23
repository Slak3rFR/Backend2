# Backend II: DISEÑO Y ARQUITECTURA BACKEND - Entrega Final

Este es un servidor backend para un sistema de e-commerce desarrollado como parte de la entrega final del curso. Implementa un carrito de compras, gestión de productos en tiempo real con Socket.io, autenticación de usuarios con JWT, recuperación de contraseña, y una arquitectura profesional basada en patrones como Repository y DTO.

## Descripción

El proyecto incluye:
- Gestión de productos (creación, lectura, actualización, eliminación) con roles (solo admin).
- Carrito de compras con lógica de compra y manejo de stock.
- Autenticación y autorización con Passport.js y middleware personalizado.
- Recuperación de contraseña vía correo electrónico.
- Renderizado de vistas con Handlebars y comunicación en tiempo real con Socket.io.

## Requisitos

- **Node.js**: v18.x LTS o superior (se probó con v22.11.0).
- **MongoDB**: Debe estar instalado y corriendo localmente (puerto 27017 por defecto).
- **npm**: v10.x o superior.
- **Git**: Para clonar el repositorio.

## Instalación

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/backend-entrega1.git
   cd backend-entrega1

Instala las dependencias:
Asegúrate de tener Node.js y npm instalados. Luego, ejecuta:bash

npm install

Configura las variables de entorno:
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:plaintext

PORT=8080
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_secreto_jwt_seguro
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password

Notas:Reemplaza tu_secreto_jwt_seguro con una clave segura.
Usa un correo Gmail para MAIL_USER y genera una contraseña de aplicación en la configuración de seguridad de Google para MAIL_PASS.
Asegúrate de que MongoDB esté corriendo (mongod en otra terminal).

Inicia la base de datos:Inicia MongoDB en tu máquina local ejecutando:bash

mongod

O usa un servicio como MongoDB Atlas ajustando MONGO_URI en el .env.

Uso

Inicia el servidor:
Ejecuta el siguiente comando para iniciar el servidor en modo desarrollo:bash

npm run start:dev

Verás mensajes como MongoDB connected y Server running on port 8080.

Prueba las rutas:
Usa una herramienta como Postman, cURL o el navegador para probar las siguientes rutas:Registro de usuario:Método: POST
URL: http://localhost:8080/api/users/register
Body (JSON):json

{
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@example.com",
  "age": 25,
  "password": "123456"
}

Respuesta esperada: { message: 'Usuario registrado', user: {...} }

Login:Método: POST
URL: http://localhost:8080/api/users/login
Body (JSON):json

{
  "email": "juan@example.com",
  "password": "123456"
}

Respuesta esperada: { message: 'Login exitoso', token: 'tu-token-jwt', user: {...} }

Información del usuario actual:Método: GET
URL: http://localhost:8080/api/sessions/current
Headers: Authorization: Bearer tu-token-jwt
Respuesta esperada: { user: {...} } (sin datos sensibles)

Lista de productos:Método: GET
URL: http://localhost:8080/api/products
Respuesta esperada: { status: 'success', payload: [...] }

Crear carrito:Método: POST
URL: http://localhost:8080/api/carts
Headers: Authorization: Bearer tu-token-jwt
Respuesta esperada: { status: 'success', payload: {...} }

Agregar producto al carrito:Método: POST
URL: http://localhost:8080/api/carts/:cid/product/:pid
Headers: Authorization: Bearer tu-token-jwt
Respuesta esperada: { status: 'success', message: 'Product added to cart' }

Realizar compra:Método: POST
URL: http://localhost:8080/api/carts/:cid/purchase
Headers: Authorization: Bearer tu-token-jwt
Respuesta esperada: { status: 'success', message: 'Purchase completed', ticket: {...} } o { status: 'partial', message: 'Some products are out of stock', outOfStock: [...] }

Vista en tiempo real:URL: http://localhost:8080/realtimeproducts
Headers: Authorization: Bearer tu-token-jwt
Abre la consola del navegador (F12) para ver eventos de Socket.io.

Recuperación de contraseña:Método: POST
URL: http://localhost:8080/api/users/forgot-password
Body (JSON):json

{ "email": "juan@example.com" }

Respuesta esperada: { message: 'Reset password email sent' }
Revisa tu correo para el enlace de restablecimiento (expira en 1 hora).

Testing

Prueba la autenticación con un usuario admin y user para verificar los roles.
Simula compras con stock insuficiente para validar la lógica de outOfStock.
Usa la consola del navegador para interactuar con la vista /realtimeproducts (agregar/eliminar productos).

Notas Adicionales

Advertencia de punycode: Al iniciar el servidor, aparece una advertencia de deprecación (DEP0040) relacionada con el módulo punycode, que es obsoleto en Node.js v22.11.0. Esto no afecta el funcionamiento actual, pero puede requerir ajustes en futuras versiones de Node.js o dependencias (como mongoose o nodemailer).
Seguridad: No subas el archivo .env a GitHub; agrégalo a .gitignore.
Despliegue: Para producción, considera usar un servicio como Render o Heroku, ajustando MONGO_URI a una base de datos remota.

Contribuciones

Cualquier sugerencia o mejora es bienvenida. Abre un issue o pull request en el repositorio.

AutorFranco [(https://github.com/Slak3rFR)]
Fecha: 23 de julio de 2025