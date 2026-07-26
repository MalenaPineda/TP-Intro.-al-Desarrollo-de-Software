

import { Router } from 'express';
import { getTareas,getRankingTareas, getTareasPorId,crearTarea, borrarTarea, cambiarEstadoTarea, getTareasCompletas, asignarUsuario, getMisTareas, getTareasDeOtros, getTareasDisponibles } from '../../../db/tareas.js';

export const rutaTareas = Router();

// Tareas disponibles o sin asignar
rutaTareas.get('/disponibles', async (req, res) => {
    try {
        const tareas = await getTareasDisponibles();
        res.json(tareas);
    } catch (error) {
        console.error("Error al obtener tareas disponibles", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

});
//Mostrar tareas con información completa
rutaTareas.get('/completas', async (req,res) => {
    try {
        const tareas = await getTareasCompletas();
        res.json(tareas);

    } catch (error) {
        console.log("Error al obtener tareas", error)
        res.status(500).json({error: "Error interno del servidor"});
    }
})


// Mis tareas
rutaTareas.get('/mias/:id_user', async (req, res) => {
    try {
        const { id_user } = req.params;
        const tareas = await getMisTareas(id_user);
        res.json(tareas);
    } catch (error) {
        console.error("Error al obtener mis tareas", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Tareas de otros
rutaTareas.get('/otros/:id_user', async (req, res) => {
    try {
        const { id_user } = req.params;
        const tareas = await getTareasDeOtros(id_user);
        res.json(tareas);
    } catch (error) {
        console.error("Error al obtener tareas de otros", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Mostrar todas las tareas
rutaTareas.get('/', async (req,res) => {
    try {
        const tareas = await getTareas();
        res.json(tareas);
    } catch(error) {
        console.log("Error al obtener tareas", error)
        res.status(500).json({error: "Error interno del servidor"});
    }
});


//Mostrar tareas por id
rutaTareas.get('/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const tarea = await getTareasPorId(id);

        if (!tarea) {
            return res.status(404).json({error: "Tarea no encontrada"});
        }
        res.json(tarea)
    } catch(error) {
        console.error("Error al obtener tarea", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});



//Crear una tarea
rutaTareas.post('/', async (req,res) => {
    try {
        const {descripcion, fecha_vencimiento, id_categoria, notas} = req.body;
        if (!descripcion || !id_categoria) {
           return res.status(400).json({"Error":"Datos obligatorios no ingresados"})
        }
           const tarea = await crearTarea(descripcion,fecha_vencimiento,id_categoria, notas);
           res.status(201).json(tarea);

    } catch (error) {
        console.error("Error al cargar tarea", error);
        res.status(500).json({"error":"Fallo en el servidor"});
    }
});
//Borrar una tarea
rutaTareas.delete('/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const tarea = await borrarTarea(id);

        if (!tarea) {
            return res.status(404).json({"error":"Tarea no encontrada"});
        }
        res.json({mensaje: "Tarea eliminada correctamente", tarea});
    } catch (error) {
        console.error("Error al eliminar tarea")
        res.status(500).json({error: "Error en el servidor"});
    }
 });
//Actualizar estado de una tarea
 rutaTareas.patch('/:id', async (req,res) => {
    try{
        const {id} = req.params
        const {estado} = req.body;
        const estadosValidos = ['pendiente', 'en progreso','hecha']

        const tarea = await getTareasPorId(id);
        if(!tarea) {
            console.error("No existe la tarea");
            return res.status(404).json({error:"Tarea no encontrada"});
        }
        if(!estado) {
            console.error("Estado mal ingresado");
            return res.status(400).json({error:"Estado mal ingresado"});
        } 
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ error: "Estado inválido. Debe ser pendiente, en progreso o completada" });
        }

        const resultado = await cambiarEstadoTarea(id,estado);
        res.json(resultado);
        
    } catch (error) {
        console.error("Error al cambiar estado",error);
        res.status(500).json({error: "Error interno del servidor"});
    }
 });

 //Asignar tarea a usuario 
 rutaTareas.post('/:id/usuarios', async (req,res)=> {
    try {  
        const { id }= req.params;
        const {id_user} = req.body;

        const tarea = await getTareasPorId(id);
        if(!tarea) {
            return res.status(404).json({error: "Tarea no encontrada"});
        }

        if (!(id_user)) {
            console.error("Error: usuario no encontrado.");
            return res.status(400).json({error: "El id_user es obligatorio"});
        }

        const resultado = await asignarUsuario(id,id_user);
        res.status(201).json(resultado);

    } catch (error) {
        console.error("Error interno al asignar tarea");
        res.status(500).json({error: "Error interno del servidor"});
    }   
 })

rutaTareas.get("/ranking", async (req, res) => {
  try {
    const ranking = await getRankingTareas();
    res.json(ranking);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
