const express = require("express");
const app = express();

app.use(express.json());

let biblioteca = [];

// POST: Agregar un libro
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

// GET: Obtener todos los libros
app.get("/biblioteca", (req, res) => {
  res.json(biblioteca);
});

// GET por ISBN
app.get("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");
  res.json(libro);
});

// PUT por ISBN: Actualizar un libro
app.put("/biblioteca/:isbn", (req, res) => {
  const libro = biblioteca.find((i) => i.isbn === req.params.isbn);
  if (!libro) return res.status(404).send("No se ha encontrado el libro.");

  libro.titulo = req.body.titulo;
  libro.autor = req.body.autor;
  libro.precio = req.body.precio;
  libro.url = req.body.url;
  res.json(libro);
});

// DELETE por ISBN: Eliminar un libro
app.delete("/biblioteca/:isbn", (req, res) => {
  const libroIndex = biblioteca.findIndex((i) => i.isbn === req.params.isbn);
  if (libroIndex === -1)
    return res.status(404).send("El libro no fue encontrado.");

  const deletedLibro = biblioteca.splice(libroIndex, 1);
  res.json(deletedLibro[0]);
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en el puerto 3000");
});
