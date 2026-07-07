# FISCorp – Área de Calidad de Software
## Guía de Práctica: Pruebas Automatizadas con Cypress
*Capacitación al equipo de desarrollo (30 min)*

---

## 1. ¿Qué es Cypress?

Cypress es un framework de pruebas end-to-end (E2E) de código abierto para aplicaciones web modernas. Se ejecuta dentro del mismo navegador que la aplicación, controlando el DOM y las peticiones de red en tiempo real, a diferencia de herramientas basadas en Selenium WebDriver. Sirve para automatizar pruebas funcionales que simulan la interacción real de un usuario (clics, escritura, navegación) y para validar la integración entre frontend y backend, como en la práctica de esta guía.

| Ventajas | Desventajas | Casos límite (edge cases) |
|---|---|---|
| Espera automática, sin sleeps manuales | Solo JavaScript/TypeScript | Elementos que cargan de forma asíncrona |
| Capturas y videos automáticos | Sin soporte nativo multi-pestaña | Elementos duplicados en el DOM |
| Sintaxis JS sencilla | Soporte móvil limitado | Listas vacías o campos vacíos |
| Consola visual y "time travel" | Complejo probar multi-dominio | Errores de red (404/500) y estado entre tests |

---

## 2. Objetivo y Material Provisto

**Objetivo:** escribir 10 pruebas con Cypress para una app To-Do List: 5 pruebas de **FRONTEND** (interfaz de usuario) y 5 pruebas de **BACKEND** (API REST) usando `cy.request()`.

Se entrega a cada estudiante un backend en Node.js/Express con API REST (CRUD) y un frontend HTML/React/Vue que ya consume dicha API.

**Repositorio:** https://github.com/Djojavi/FisCorp

---

## 3. Requisitos e Instalación de Cypress

- Node.js 16+ y npm; editor de código; proyecto base entregado por el instructor.

1. Instalar:
```bash
   npm install cypress --save-dev
```
2. Abrir: `npx cypress open` → elegir **"E2E Testing"** y el navegador.
3. Configurar `baseUrl` en `cypress.config.js`:
```js
   module.exports = { e2e: { baseUrl: 'http://localhost:3000' } };
```
4. Iniciar backend y frontend, y crear `cypress/e2e/todo.cy.js`.

---

## 4. Cheat Sheet de Cypress

### 4.1 Frontend (interfaz de usuario)

| Elemento / Comando | Descripción y uso |
|---|---|
| `describe` / `it` / `beforeEach` | Agrupan (`describe`), definen (`it`) y preparan (`beforeEach`) cada prueba. |
| `cy.visit('/')` | Carga la URL base (frontend) configurada en `cypress.config.js`. |
| `cy.get('selector')` | Selecciona elementos del DOM (ideal: `[data-testid="..."]`). |
| `cy.contains('texto')` | Busca un elemento que contenga el texto indicado. |
| `cy.type('texto')` / `cy.click()` | Escribe en un input / simula un clic. |
| `cy.find()` / `.parent()` / `.closest()` | Navega a elementos descendientes, padres o ancestros. |
| `.should('be.visible' \| 'have.value' \| 'contain.text' \| 'have.class' \| 'not.exist')` | Assertions sobre visibilidad, valor, texto, clase CSS o ausencia en el DOM. |

```js
describe('Todo List – Page load', () => {
  it('displays the page title', () => {
    setup();
    cy.get('h1').should('contain', 'Todo List');
  });
});
```

### 4.2 Backend / API (con cy.request)

| Elemento / Comando | Descripción y uso |
|---|---|
| `cy.request('GET', url)` | Hace una petición HTTP directa a la API, sin pasar por la interfaz. |
| `cy.request('POST', url, body)` | Envía una petición POST con un cuerpo (payload) en formato JSON. |
| `cy.request('PUT', url, body)` / `('PATCH', url, body)` | Actualiza un recurso existente (ej. marcar tarea completada). |
| `cy.request('DELETE', url)` | Elimina un recurso existente en la API. |
| `cy.request(...).then((response) => {...})` | Captura la respuesta de la petición para inspeccionarla y hacer asserts. |
| `response.status` | Código de estado HTTP devuelto (200, 201, 204, 404, etc.). |
| `response.body` | Cuerpo de la respuesta, ya parseado como objeto/arreglo JSON. |
| `expect(response.status).to.eq(200)` | Assertion estilo Chai sobre el código de estado. |
| `failOnStatusCode: false` | Opción para probar respuestas de error (4xx/5xx) sin que Cypress falle automáticamente. |

```js
describe('GET /tasks', () => {
  it('responde con status 200', () => {
    cy.request('GET', BASE).its('status').should('eq', 200);
  });
});
```

---

## 5. Pruebas de Frontend (5 pts, 1 pt c/u)

El proyecto entregado ya incluye `cypress/e2e/todo.cy.js` con la configuración base (`describe`, `beforeEach` con `cy.visit()`) y una prueba de ejemplo. Cada estudiante debe **AÑADIR 5 pruebas** de interfaz usando el cheat sheet 4.1:

1. Verificar carga de la página (1 pt).
2. Crear una tarea desde el formulario (1 pt).
3. Verificar que la tarea aparece en la lista (1 pt).
4. Completar una tarea (1 pt).
5. Eliminar una tarea (1 pt).

---

## 6. Pruebas de Backend con cy.request (5 pts, 1 pt c/u)

El proyecto entregado incluye `cypress/e2e/todo-api.cy.js` con la configuración base (`describe`, constante `apiUrl`) y una prueba de ejemplo. Cada estudiante debe **AÑADIR 5 pruebas** de API usando el cheat sheet 4.2, sin pasar por la interfaz:

1. `GET /todos` responde 200 y devuelve un arreglo (1 pt).
2. `POST /todos` crea una tarea y responde 201 con el objeto creado (1 pt).
3. Verificar que la tarea creada existe en la respuesta de `GET /todos` (1 pt).
4. `PUT`/`PATCH` `/todos/:id` marca la tarea como completada y responde 200 (1 pt).
5. `DELETE /todos/:id` elimina la tarea y responde 200/204 (1 pt).

---

**Evidencia:** captura de consola con las 10 pruebas en "passing" y los archivos `.cy.js` completos.