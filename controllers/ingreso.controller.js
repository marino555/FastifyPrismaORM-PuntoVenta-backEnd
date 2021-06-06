const fp = require("fastify-plugin");

async function IngresosCool(fastify, options, next) {
    
    const PIngreso = fastify.prisma.ingresos // ya con el cliente de prisma decorado, lo usamos con el modelo Ingreso de la migracion ya creada

    fastify.decorate('verIngresos', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

      try {
        const todos = await PIngreso.findMany({
          where: {
                nombre: {
                  contains: consulta,
                },
              },
        include: { categoria: true },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Ingresos, osea todas en la base de datos"})
      }
   })
   .decorate('verIngreso', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
    // if (id.length < 10 ) { return reply.status(500).send({error: "El Ingreso ID No es valido"}) }        
     try {
       const Ingreso = await PIngreso.findUnique({ 
         where: { id: Number(id) }, 
         include: { user: true, categoria: true },  
            }) 
        console.log(Ingreso)
       if (Ingreso) { return Ingreso; }   

       return reply.status(500).send({error: "no se encontro el Ingreso en la base de datos"})
       
      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "no se encontro la Ingreso en la base de datos"})
     }
    })
    .decorate('crearIngreso', async (request, reply) => {
      console.log(request.body)
      const data = request.body

      const {nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      
      try {
        const todos = await PIngreso.create({  
          data: {
            nombre,
            descripcion,
            estado,
            codigo,
            precio_venta,
            precio_compra,
            stock,
            userId: userId || undefined, // sets userId of Profile record
            catId: catId
          },
        include: {
          user: true, // Include all posts in the returned object
          categoria: true
        }, 
      })
   /*      const todos = await PIngreso.update({   este codigo funciona================
          where: { ...user },
          data: {
            Ingreso: {
              create: { nombre, descripcion, estado},
            },
          },
        include: {
          Ingreso: true, // Include all posts in the returned object
        }, 
      }) */
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La Ingreso en la base de datos"})
      }
    })
    .decorate('actualIngreso', async (request, reply) => { 
      const data = request.body
      const { id, nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      console.log(data)
      
      const Ingreso = await PIngreso.findFirst({
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
      
      if (!Ingreso) { return reply.status(500).send({error: "La Ingreso No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Ingreso.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PIngreso.update({
          where: { id: Number(id) },
          data: {
            nombre,
            descripcion,
            estado,
            codigo,
            precio_venta,
            precio_compra,
            stock,
            userId: userId || undefined, // sets userId of Profile record
            catId: catId
          },
        include: {
          user: true, // Include all posts in the returned object
          categoria: true
        }, 
        })
         console.log("actualizado", result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar la Ingreso", error)
        return reply.status(500).send({error: "no pudimos actualizar el Ingreso"})
      }
    })
    .decorate('activoIngreso', async (request, reply) => { // que aqui en Activar Ingreso
     //  console.log(request.body)
       const { id } = request.body
      
      try {
        // const result = await Models.Ingreso.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PIngreso.update({
          where: { id: Number(id) },
          data :{ 
            estado: 1
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Ingreso", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Ingreso"})
      }
    })
    .decorate('desactivoIngreso', async (request, reply) => {
      // console.log(request.body)
        const { id } = request.body
      
      try {
        // const result = await Models.Ingreso.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PIngreso.update({
          where: { id: Number(id) },
          data :{ 
            estado: 0
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Ingreso", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Ingreso"})
      }
    })
    .decorate('borrarIngreso', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      
      // const Ingreso = await PIngreso.findUnique({ where: { id: Number(id) } })
     // if (!Ingreso) { return reply.status(500).send({error: "La Ingreso No existe para Borrarlo"}) }
      
      try {
        const result = await PIngreso.delete({ where: { id: Number(id) }  })
        // console.log(result)
        return { borrado: true, nombre: result.nombre }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro la Ingreso para borrar o hubo un error en la base de datos"})
      }
    })
  
    
    next()
  }
  
  module.exports = fp(IngresosCool);