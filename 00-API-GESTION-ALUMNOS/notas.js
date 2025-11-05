import express from "express";
import { db } from "./db.js";
import { validarNota, validarId, manejarValidaciones } from "./validaciones.js";
import { verificarAutenticacion } from "./auth.js";
const router = express.Router();

//  Obtener todas las notas (con nombres de alumno y materia)
router.get("/", async (req, res) => {
  const [rows] = await db.query(`
    SELECT n.id, a.nombre AS alumno, m.nombre AS materia,
           n.nota1, n.nota2, n.nota3
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
  `);
  res.json(rows);
});

//  Obtener una nota por ID
router.get("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(`
    SELECT n.id, a.nombre AS alumno, m.nombre AS materia,
           n.nota1, n.nota2, n.nota3
    FROM notas n
    JOIN alumnos a ON n.alumno_id = a.id
    JOIN materias m ON n.materia_id = m.id
    WHERE n.id = ?
  `, [id]);

  if (rows.length === 0)
    return res.status(404).json({ message: "Registro no encontrado" });

  res.json(rows[0]);
});

// Crear una nueva nota
router.post("/", verificarAutenticacion,validarNota, manejarValidaciones, async (req, res) => {
  const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

  //  Verificar existencia de alumno y materia ANTES del insert
  const [alumnoExiste] = await db.query("SELECT id FROM alumnos WHERE id = ?", [alumno_id]);
  const [materiaExiste] = await db.query("SELECT id FROM materias WHERE id = ?", [materia_id]);

  if (alumnoExiste.length === 0)
    return res.status(400).json({ message: "El alumno no existe" });

  if (materiaExiste.length === 0)
    return res.status(400).json({ message: "La materia no existe" });

  //  Insertar si todo está bien
  const [resultado] = await db.query(
    "INSERT INTO notas (alumno_id, materia_id, nota1, nota2, nota3) VALUES (?, ?, ?, ?, ?)",
    [alumno_id, materia_id, nota1, nota2, nota3]
  );

  if (resultado.affectedRows === 0)
    return res.status(500).json({ message: "Error al registrar nota" });

  res.status(201).json({
    message: "Nota registrada correctamente",
    id_insertado: resultado.insertId,
  });
});

//  Editar nota existente
router.put("/:id",verificarAutenticacion, validarId, validarNota, manejarValidaciones, async (req, res) => {
  const { id } = req.params;
  const { alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

  //  Verificar existencia ANTES del update
  const [alumnoExiste] = await db.query("SELECT id FROM alumnos WHERE id = ?", [alumno_id]);
  const [materiaExiste] = await db.query("SELECT id FROM materias WHERE id = ?", [materia_id]);

  if (alumnoExiste.length === 0)
    return res.status(400).json({ message: "El alumno no existe" });

  if (materiaExiste.length === 0)
    return res.status(400).json({ message: "La materia no existe" });

  // Actualizar registro
  const [resultado] = await db.query(
    "UPDATE notas SET alumno_id=?, materia_id=?, nota1=?, nota2=?, nota3=? WHERE id=?",
    [alumno_id, materia_id, nota1, nota2, nota3, id]
  );

  if (resultado.affectedRows === 0)
    return res.status(404).json({ message: "Registro no encontrado" });

  res.json({ message: "Nota actualizada correctamente" });
});

//  Eliminar una nota
router.delete("/:id",verificarAutenticacion, validarId, manejarValidaciones, async (req, res) => {
  const { id } = req.params;

  //  Solo eliminar (no hace falta validar alumno/materia)
  const [resultado] = await db.query("DELETE FROM notas WHERE id = ?", [id]);

  if (resultado.affectedRows === 0)
    return res.status(404).json({ message: "Registro no encontrado" });

  res.json({ message: "Nota eliminada correctamente" });
});

export default router;
