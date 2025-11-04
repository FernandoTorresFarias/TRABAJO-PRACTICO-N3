import { body, param, validationResult } from "express-validator";

///------VALIDACIONES PARA ALUMNO----/////

// Validacion para crear o editar alumno
export const validarAlumno = [
  body("nombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido")
    .trim()
    .notEmpty().withMessage("El apellido es obligatorio")
    .isLength({ min: 2 }).withMessage("El apellido debe tener al menos 2 caracteres"),

  body("dni")
    .notEmpty().withMessage("El DNI es obligatorio")
    .isNumeric().withMessage("El DNI debe contener solo números")
    .isLength({ min: 7, max: 8 }).withMessage("El DNI debe tener entre 7 y 8 dígitos"),
];



//--------------VALIDACIONES PARA MATERIAS --------/////


// Validar datos del body para Materias
export const validarMateria = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede tener más de 100 caracteres"),
  body("codigo")
    .trim()
    .notEmpty()
    .withMessage("El código no puede estar vacío")
    .isLength({ max: 20 })
    .withMessage("El código no puede tener más de 20 caracteres"),
  body("year")
    .isInt({ min: 2000, max: 2100 })
    .withMessage("El año debe ser un número entre 2000 y 2100"),
];

///----VALIDACION PARA USUARIOS----//////

export const validarUsuario = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ max: 100 })
    .withMessage("Máx. 100 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .isLength({ min: 8 })
    .withMessage("Debe tener al menos 8 caracteres"),
];

//-----VALIDAR NOTAS ---- ////

export const validarNota = [
  body("alumno_id")
    .isInt({ min: 1 })
    .withMessage("El ID del alumno debe ser un número entero positivo"),
  body("materia_id")
    .isInt({ min: 1 })
    .withMessage("El ID de la materia debe ser un número entero positivo"),
  body("nota1")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("La nota1 debe estar entre 0 y 10"),
  body("nota2")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("La nota2 debe estar entre 0 y 10"),
  body("nota3")
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage("La nota3 debe estar entre 0 y 10"),
];


////----VALIDAR ID---////

// Validacion para validar el parámetro ID
export const validarId = [
  param("id")
    .isInt({ gt: 0 }).withMessage("El ID debe ser un número entero positivo")
];




/////--- MIDDELEWARE ---- /////

// Middleware para manejar errores de validación
export const manejarValidaciones = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};
