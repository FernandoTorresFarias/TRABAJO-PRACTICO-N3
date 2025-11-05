import express from "express";
import { db } from "./db.js";
import { body } from "express-validator";
import { manejarValidaciones } from "./validaciones.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";



const router = express.Router();


//  CONFIGURACIÓN DE PASSPORT-JWT
export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Estrategia JWT
  passport.use(
    new Strategy(jwtOptions, async (payload, done) => {
      // Si el token es válido, se pasa al siguiente middleware
      done(null, payload);
    })
  );
}
//Manejar la autorizacion desde aqui!
export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

export const verificarAutorizacion = (rol) => {
  return (req, res, next) => {
    const roles = req.user.roles;
    if (!roles.includes(rol)) {
      return res
        .status(401)
        .json({ success: false, message: "Usuario no autorizado" });
    }
    next();
  };
};



//  LOGIN
router.post(
  "/login",
  // Validaciones con express-validator
  body("email").isEmail().withMessage("Debe ser un email válido"),
  body("password").isLength({ min: 8 }).withMessage("Contraseña mínima de 8 caracteres"),
  manejarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    // Buscar usuario por email
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Usuario no encontrado" });
    }

    const usuario = rows[0];

    // Comparar contraseña ingresada con el hash almacenado
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
    }

    //payload del token (con nombre y ID)
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    // Firmar token JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
    });
  }
);

export default router;
