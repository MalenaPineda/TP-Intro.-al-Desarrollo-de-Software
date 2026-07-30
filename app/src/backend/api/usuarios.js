import { Router } from "express";
import { getUsuarios, getTodosLosUsuarios, getUsuarioPorId, crearUsuario, editarUsuario, borrarUsuario  } from "../../../db/usuarios.js"

export const rutaUsuarios = Router();

//GET api/v1/usuarios - Para listar todos los usuarios activos
rutaUsuarios.get('/',async (req,res)=> {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

// GET /api/v1/usuarios/:id — Obtener un usuario por ID
rutaUsuarios.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await getUsuarioPorId(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
 

    } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


//POST: crear nuevo usuario 
rutaUsuarios.post('/',async (req,res)=> {
    try {
        const {nombre, email, contrasenia, fecha_nacimiento} = req.body;

        //Validamos campos obligatorios
        if(!nombre || !email || !contrasenia) {
            return res.status(400).json({error: "Campos obligatorios no llenados"});
        }

        const usuario = await crearUsuario(nombre, email, contrasenia,fecha_nacimiento);
        res.status(201).json(usuario);
    } catch (error) {
        //POSTGRE tiene el error 23505 (unique contraint) por si el email está repetido
        if(error.code ==="23505") {
            return res.status(409).json({error: "El email ya esta registrado"});
        }
        console.error("Error al crear usuario");
        res.status(500).json({error: "Error interno del servidor"});
    }
});


// PUT — Editar un usuario existente
rutaUsuarios.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, contrasenia, fecha_nacimiento } = req.body;

    // Validar que el usuario existe
    const existe = await getUsuarioPorId(id);
    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validar campos obligatorios
    if (!nombre || !email || !contrasenia) {
      return res.status(400).json({error: "Campos obligatorios: nombre, email, contraseña"});
    }

    const usuario = await editarUsuario(id,nombre,email,contrasenia,fecha_nacimiento);
    res.json(usuario);
  } catch (error) {
    //Mismo error POSTGRES unique contraint
     if (error.code === "23505") {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    console.error("Error al editar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE  — Borrar usuario Soft delete (desactivar usuario)
rutaUsuarios.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validamos que el usuario exista
    const existe = await getUsuarioPorId(id);
    if (!existe) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = await borrarUsuario(id);
    res.json({ mensaje: "Usuario desactivado correctamente", usuario });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
