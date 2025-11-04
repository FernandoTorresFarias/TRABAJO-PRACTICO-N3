import express from "express";
import { db } from "./db.js";
import { validarMateria, validarId, manejarValidaciones } from "./validaciones.js";

const router = express.Router();

// OBTENER TODAS LAS MATERIAS
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM materias");
  res.json(rows);
});

// OBTENER MATERIA POR ID
router.get("/:id", validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM materias WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Materia no encontrada" });
  }

  res.json(rows[0]);
});

// CREAR NUEVA MATERIA
router.post("/", validarMateria, manejarValidaciones, async (req, res) => {
  const { nombre, codigo, year } = req.body;

  const [resultado] = await db.query(
    "INSERT INTO materias (nombre, codigo, year) VALUES (?, ?, ?)",
    [nombre, codigo, year]
  );

  if (resultado.affectedRows === 0) {
    return res.status(500).json({ message: "Error al crear materia" });
  }

  res.status(201).json({
    message: "Materia creada correctamente",
    id_insertado: resultado.insertId,
  });
});

// EDITAR MATERIA EXISTENTE
router.put("/:id", validarId, validarMateria, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { nombre, codigo, year } = req.body;

  const [resultado] = await db.query(
    "UPDATE materias SET nombre = ?, codigo = ?, year = ? WHERE id = ?",
    [nombre, codigo, year, id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Materia no encontrada" });
  }

  res.json({ message: "Materia actualizada correctamente" });
});

// ELIMINAR MATERIA POR ID
router.delete("/:id", validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [resultado] = await db.query("DELETE FROM materias WHERE id = ?", [id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Materia no encontrada" });
  }

  res.json({ message: "Materia eliminada correctamente" });
});

export default router;
