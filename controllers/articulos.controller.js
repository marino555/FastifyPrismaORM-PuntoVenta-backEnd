const fp = require("fastify-plugin");

async function ArticulosCool(fastify, options, next) {
    
    const PArticulo = fastify.prisma.articulos // ya con el cliente de prisma decorado, lo usamos con el modelo Articulo de la migracion ya creada

    fastify.decorate('verArticulos', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

      try {
        const todos = await PArticulo.findMany({
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
        return reply.status(500).send({error: "no se encontro Articulos, osea todas en la base de datos"})
      }
   })
   .decorate('verArticulo', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
    // if (id.length < 10 ) { return reply.status(500).send({error: "El Articulo ID No es valido"}) }        
     try {
       const Articulo = await PArticulo.findUnique({ 
         where: { id: Number(id) }, 
         include: { user: true, categoria: true },  
            }) 
        console.log(Articulo)
       if (Articulo) { return Articulo; }   
      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "no se encontro la Articulo en la base de datos"})
     }
    })
    .decorate('crearArticulo', async (request, reply) => {
      console.log(request.body)
      const data = request.body

      const {nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      
      try {
        const todos = await PArticulo.create({  
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
   /*      const todos = await PArticulo.update({   este codigo funciona================
          where: { ...user },
          data: {
            Articulo: {
              create: { nombre, descripcion, estado},
            },
          },
        include: {
          Articulo: true, // Include all posts in the returned object
        }, 
      }) */
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La Articulo en la base de datos"})
      }
    })
    .decorate('actualArticulo', async (request, reply) => { 
      const data = request.body
      const { id, nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      console.log(data)
      
      const Articulo = await PArticulo.findFirst({
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
      
      if (!Articulo) { return reply.status(500).send({error: "La Articulo No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Articulo.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PArticulo.update({
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
        console.log("no pudimos actualizar la Articulo", error)
        return reply.status(500).send({error: "no pudimos actualizar el Articulo"})
      }
    })
    .decorate('activoArticulo', async (request, reply) => { // que aqui en Activar Articulo
     //  console.log(request.body)
       const { id } = request.body
      
      try {
        // const result = await Models.Articulo.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PArticulo.update({
          where: { id: Number(id) },
          data :{ 
            estado: 1
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Articulo", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Articulo"})
      }
    })
    .decorate('desactivoArticulo', async (request, reply) => {
      // console.log(request.body)
        const { id } = request.body
      
      try {
        // const result = await Models.Articulo.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PArticulo.update({
          where: { id: Number(id) },
          data :{ 
            estado: 0
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Articulo", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Articulo"})
      }
    })
    .decorate('borrarArticulo', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      
      // const Articulo = await PArticulo.findUnique({ where: { id: Number(id) } })
     // if (!Articulo) { return reply.status(500).send({error: "La Articulo No existe para Borrarlo"}) }
      
      try {
        const result = await PArticulo.delete({ where: { id: Number(id) }  })
        // console.log(result)
        return { borrado: true, nombre: result.nombre }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro la Articulo para borrar o hubo un error en la base de datos"})
      }
    })
  
    
    next()
  }
  
  module.exports = fp(ArticulosCool);