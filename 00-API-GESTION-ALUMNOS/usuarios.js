import express from "express";
import { db } from "./db.js";
import { validarUsuario, validarId, manejarValidaciones } from "./validaciones.js";
import bcrypt from "bcrypt";
import passport from "passport";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

//  Obtener todos los usuarios (solo requiere token válido)
router.get(
  "/",
  verificarAutenticacion,
  async (req, res) => {
    const [rows] = await db.query("SELECT id, nombre, email FROM usuarios");
    res.json(rows);
  }
);

//  Obtener usuario por ID
router.get("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT id, nombre, email FROM usuarios WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json(rows[0]);
});

//  Crear nuevo usuario (con contraseña hasheada)
router.post("/", validarUsuario, manejarValidaciones, async (req, res) => {
  const { nombre, email, password } = req.body;

  // Verificar si el usuario ya existe
  const [existe] = await db.query("SELECT id FROM usuarios WHERE email = ?", [email]);
  if (existe.length > 0) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Hashear la contraseña antes de guardarla
  const passwordHash = await bcrypt.hash(password, 10);

  const [resultado] = await db.query(
    "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
    [nombre, email, passwordHash]
  );

  res.status(201).json({
    message: "Usuario creado correctamente",
    id_insertado: resultado.insertId,
  });
});

//  Editar usuario existente
router.put("/:id",verificarAutenticacion, validarId, validarUsuario, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const [resultado] = await db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, password_hash = ? WHERE id = ?",
    [nombre, email, passwordHash, id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ message: "Usuario actualizado correctamente" });
});

//  Eliminar usuario
router.delete("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [resultado] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  res.json({ message: "Usuario eliminado correctamente" });
});

export default router;
