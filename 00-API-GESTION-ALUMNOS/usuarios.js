import express from "express";
import { db } from "./db.js";
import { validarUsuario, validarId, manejarValidaciones } from "./validaciones.js";

const router = express.Router();

//  Obtener todos los usuarios
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  res.json(rows);
});

//  Obtener usuario por ID
router.get("/:id", validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(rows[0]);
});

// Crear nuevo usuario
router.post("/", validarUsuario, manejarValidaciones, async (req, res) => {
  const { nombre, email, password } = req.body;

  const [resultado] = await db.query(
    "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, password]
  );

  if (resultado.affectedRows === 0) {
    return res.status(500).json({ message: "Error al crear usuario" });
  }

  res.status(201).json({
    message: "Usuario creado correctamente",
    id_insertado: resultado.insertId,
  });
});

//  Editar usuario existente
router.put("/:id", validarId, validarUsuario, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  const [resultado] = await db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?",
    [nombre, email, password, id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ message: "Usuario actualizado correctamente" });
});

//  Eliminar usuario
router.delete("/:id", validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [resultado] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ message: "Usuario eliminado correctamente" });
});

export default router;
