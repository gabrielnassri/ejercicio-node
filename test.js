const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

let biblioteca = [];

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Biblioteca",
      version: "1.0.0",
      description: "API para gestionar libros en una biblioteca",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./test.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - isbn
 *         - precio
 *         - url
 *       properties:
 *         titulo:
 *           type: string
 *           description: Título del libro
 *         autor:
 *           type: string
 *           description: Autor del libro
 *         isbn:
 *           type: string
 *           description: ISBN único del libro
 *         precio:
 *           type: number
 *           description: Precio del libro
 *         url:
 *           type: string
 *           description: URL de referencia o imagen del libro
 */

/**
 * @swagger
 * /biblioteca:
 *   post:
 *     summary: Crea un nuevo libro
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       201:
 *         description: Libro creado exitosamente
 */
app.post("/biblioteca", (req, res) => {
  const newLibro = {
    titulo: req.body.titulo,
    autor: req.body.autor,
    isbn: req.body.isbn,
    precio: req.body.precio,
    url: req.body.url,
  };
  biblioteca.push(newLibro);
  res.status(201).json(newLibro);
});

/**
 * @swagger
 * /biblioteca:
 *   get:
 *     summary: Obtiene todos los libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
app.get("/biblioteca", (req, res) => {
  res.json(biblioteca);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   get:
 *     summary: Obtiene un libro por ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: ISBN del libro
 *     responses:
 *       200:
 *         description: Detalles del libro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Libro'
 *       404:
 *         description: Libro no encontrado
 */
app.get("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");
  res.json(libro);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   put:
 *     summary: Actualiza un libro por ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: ISBN del libro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro actualizado exitosamente
 *       404:
 *         description: Libro no encontrado
 */
app.put("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");

  libro.titulo = req.body.titulo;
  libro.autor = req.body.autor;
  libro.precio = req.body.precio;
  libro.url = req.body.url;
  res.json(libro);
});

/**
 * @swagger
 * /biblioteca/{isbn}:
 *   delete:
 *     summary: Elimina un libro por ISBN
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: ISBN del libro a eliminar
 *     responses:
 *       200:
 *         description: Libro eliminado exitosamente
 *       404:
 *         description: Libro no encontrado
 */
app.delete("/biblioteca/:isbn", (req, res) => {
  const libroIndex = biblioteca.findIndex((i) => i.isbn === req.params.isbn);
  if (libroIndex === -1)
    return res.status(404).send("El libro no fue encontrado.");

  const deletedLibro = biblioteca.splice(libroIndex, 1);
  res.json(deletedLibro[0]);
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
  console.log("Documentación Swagger disponible en http://localhost:3000/api-docs");
});
