const fp = require("fastify-plugin");

async function PersonasCool(fastify, options, next) {
    
    const PPersona = fastify.prisma.personas // ya con el cliente de prisma decorado, lo usamos con el modelo Persona de la migracion ya creada

    fastify.decorate('verPersonas', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

       const formato = {
        OR: [
          {
            nombre: {
              contains: consulta,
            },
          },
          {
            num_documento: {
              contains: consulta,
            },
          },
        ],
       }

       const buscar = consulta ? {...formato} : null
      try {
        const todos = await PPersona.findMany({
          where: {
               ...buscar,
              },
          orderBy: {
                 createdAt: 'desc',
                         },
          include: { user: true },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Personas, osea todas en la base de datos"})
      }
   })
    .decorate('verClientes', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query
       const formato = {
        OR: [
          {
            nombre: {
              contains: consulta,
            },
          },
          {
            num_documento: {
              contains: consulta,
            },
          },
        ],

       }

       const buscar = consulta ? {...formato} : null

      try {
        const todos = await PPersona.findMany({
          where: {
            AND: {
              tipo_persona: "CLIENTE",
            },
            ...buscar,
          },
          orderBy: {
            createdAt: 'desc',
          },
          
        include: { user: true },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Personas, osea todas en la base de datos"})
      }
   })
    .decorate('verProveedores', async (request, reply) => {

      //  console.log("proveedores mas", request.query)
       const { consulta } = request.query

       const formato = {
        OR: [
          {
            nombre: {
              contains: consulta,
            },
          },
          {
            num_documento: {
              contains: consulta,
            },
          },
        ],

       }

       const buscar = consulta ? {...formato} : null

      try {
        const todos = await PPersona.findMany({
          where: {
            AND: {
              tipo_persona: "PROVEEDOR",
            },
            ...buscar,
          },
          orderBy: {
            createdAt: 'desc',
          },
        include: { user: true },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Personas, osea todas en la base de datos"})
      }
   })
   .decorate('verPersona', async (request, reply) => {
     console.log("ver el id de ruta", request.params)
     const { id } = request.params
      
     try {
       const Persona = await PPersona.findUnique({  
         where: { id: Number(id) }, 
         include: { user: true },  
            }) 
        console.log(Persona)
       if (Persona) { return Persona; }   

       return reply.status(500).send({error: "no se encontro la Persona en la base de datos"})

      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "paso un error en la base de datos"})
     }
    })
    .decorate('crearPersona', async (request, reply) => {
      console.log(request.body)
      const data = request.body

      const {nombre, email, estado, tipo_persona, tipo_documento, num_documento, direccion, userId, telefono } = data
      
      try {
        const todos = await PPersona.create({  
          data: {
            nombre,
            email,
            estado,
            tipo_persona,
            tipo_documento,
            num_documento,
            direccion,
            telefono,
            userId, // sets userId of Profile record
          },
        include: {
          user: true // Include all posts in the returned object
        }, 
      })
   /*      const todos = await PPersona.update({   este codigo funciona================
          where: { ...user },
          data: {
            Persona: {
              create: { nombre, descripcion, estado},
            },
          },
        include: {
          Persona: true, // Include all posts in the returned object
        }, 
      }) */
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La Persona en la base de datos"})
      }
    })
    .decorate('actualPersona', async (request, reply) => { 
      const data = request.body
      const { id, nombre, email, estado, tipo_persona, tipo_documento, num_documento, direccion, userId, telefono } = data
      console.log(data)
      
      const Persona = await PPersona.findFirst({
        where: {
          AND: [
            {
              id: Number(id)              
            },
            {
              estado: {
                equals: 1,
              },
            },
          ],
        },
      })
      
      if (!Persona) { return reply.status(500).send({error: "La Persona No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Persona.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PPersona.update({
          where: { id: Number(id) },
          data: {
            nombre,
            email,
            estado,
            tipo_persona,
            tipo_documento,
            num_documento,
            direccion,
            telefono,
            userId, // sets userId of Profile record
          },
        include: {
          user: true, // Include all posts in the returned object
        }, 
        })
         console.log("actualizado", result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar la Persona", error)
        return reply.status(500).send({error: "no pudimos actualizar el Persona"})
      }
    })
    .decorate('activoPersona', async (request, reply) => { // que aqui en Activar Persona
     //  console.log(request.body)
       const { id } = request.body
      
      try {
        // const result = await Models.Persona.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PPersona.update({
          where: { id: Number(id) },
          data :{ 
            estado: 1
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Persona", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Persona"})
      }
    })
    .decorate('desactivoPersona', async (request, reply) => {
      // console.log(request.body)
        const { id } = request.body
      
      try {
        // const result = await Models.Persona.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PPersona.update({
          where: { id: Number(id) },
          data :{ 
            estado: 0
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Persona", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Persona"})
      }
    })
    .decorate('borrarPersona', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      
      // const Persona = await PPersona.findUnique({ where: { id: Number(id) } })
     // if (!Persona) { return reply.status(500).send({error: "La Persona No existe para Borrarlo"}) }
      
      try {
        const result = await PPersona.delete({ where: { id: Number(id) }  })
        // console.log(result)
        return { borrado: true, nombre: result.nombre }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro la Persona para borrar o hubo un error en la base de datos"})
      }
    })
  
    
    next()
  }
  
  module.exports = fp(PersonasCool);