import express from "express";
import { db } from "./db.js";
import { validarAlumno, validarId, manejarValidaciones} from "./validaciones.js";
import passport from "passport";
import { verificarAutenticacion } from "./auth.js";
const router = express.Router();


// OBTENER TODOS LOS ALUMNOS

router.get("/",verificarAutenticacion, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM alumnos");
  res.json(rows);
});


//OBTENER ALUMNO POR ID

router.get("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM alumnos WHERE id = ?", [id]);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  res.json(rows[0]);
});


// CREAR NUEVO ALUMNO

router.post("/",verificarAutenticacion, validarAlumno, manejarValidaciones, async (req, res) => {
  const { nombre, apellido, dni } = req.body;

  const [resultado] = await db.query(
    "INSERT INTO alumnos (nombre, apellido, dni) VALUES (?, ?, ?)",
    [nombre, apellido, dni]
  );

  if (resultado.affectedRows === 0) {
    return res.status(500).json({ message: "Error al crear alumno" });
  }

  res.status(201).json({
    message: "Alumno creado correctamente",
    id_insertado: resultado.insertId,
  });
});


 ///EDITAR ALUMNO EXISTENTE

router.put("/:id",verificarAutenticacion
, validarId, validarAlumno, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni } = req.body;

  const [resultado] = await db.query(
    "UPDATE alumnos SET nombre = ?, apellido = ?, dni = ? WHERE id = ?",
    [nombre, apellido, dni, id]
  );

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  res.json({ message: "Alumno actualizado correctamente" });
});


// ELIMINAR ALUMNO POR ID
router.delete("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;

  const [resultado] = await db.query("DELETE FROM alumnos WHERE id = ?", [id]);

  if (resultado.affectedRows === 0) {
    return res.status(404).json({ message: "Alumno no encontrado" });
  }

  res.json({ message: "Alumno eliminado correctamente" });
});

export default router;
