import express, { Router } from "express";
import cors from "cors"
import { conectarDB } from "./db.js";
import alumnosRouter from "./alumnos.js";
import materiasRouter from "./materias.js";
import usuariosRouter from "./usuarios.js"
import notasRouter from "./notas.js"
import authRouter, { authConfig } from "./auth.js"



conectarDB();
const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());
app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!");
});


//Habilito CORS
app.use(cors())

authConfig();




app.use("/alumnos", alumnosRouter);
app.use("/materias",materiasRouter);
app.use("/usuarios",usuariosRouter)
app.use("/notas",notasRouter)
app.use("/auth", authRouter);
app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`);
});
