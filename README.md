# pokedex-backend

Este es el servidor backend para la aplicación Pokedex. Proporciona una API para gestionar y consultar información sobre Pokémon y usuarios.

## URL del servidor

El servidor está desplegado en Render y puede ser accedido en la siguiente URL:

[https://api-pokedex-20x0.onrender.com](https://api-pokedex-20x0.onrender.com)

## Endpoints principales

- `/pokemons`:
  - **GET**: Obtiene la lista completa de Pokémon disponibles en la base de datos.
  - **POST**: Agrega un nuevo Pokémon a la base de datos. Requiere autenticación y datos válidos en el cuerpo de la solicitud.

- `/users`:
  - **GET**: Obtiene la información del usuario autenticado.
  - **POST**: Registra un nuevo usuario en la base de datos. Requiere datos válidos como nombre, correo electrónico y contraseña.
  - **PATCH**: Actualiza la información del usuario autenticado. Requiere autenticación y datos válidos en el cuerpo de la solicitud.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB (Atlas)
- JWT para autenticación
- Winston para logging

## Configuración local

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Crea un archivo `.env` con las variables de entorno necesarias (por ejemplo, `MONGO_URI`, `JWT_SECRET`).
4. Inicia el servidor con `npm start` o, para desarrollo, usa `npm run dev`.

## Consideraciones al usar la API en la capa gratuita

El backend está desplegado en la capa gratuita de Render, lo que significa que:

- Si el servicio no recibe tráfico durante 15 minutos, entra en un estado inactivo ("spun down").
- Cuando se realiza una nueva solicitud, el servicio se reactiva automáticamente, pero esto puede causar un retraso inicial de hasta un minuto.

### Recomendaciones para minimizar el impacto

1. **Indicadores de carga**: Implementa un mensaje de "Cargando..." en el frontend mientras espera la respuesta del backend.
2. **Ping periódico**: Considera enviar solicitudes periódicas al backend para mantenerlo activo (esto puede consumir horas gratuitas más rápido).
3. **Optimización de la primera solicitud**: Realiza una solicitud ligera al inicio para reducir el tiempo de espera.

Este comportamiento es una limitación de la capa gratuita y no afecta a servicios en capas de pago.

## Contribuciones

Si deseas contribuir, por favor abre un issue o envía un pull request.
