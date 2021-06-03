const fp = require("fastify-plugin");

async function categoriasCool(fastify, options, next) {
    
    const PCategoria = fastify.prisma.categorias // ya con el cliente de prisma decorado, lo usamos con el modelo Categoria de la migracion ya creada

    fastify.decorate('verCategorias', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

      try {
        const todos = await PCategoria.findMany({
          where: {
                nombre: {
                  contains: consulta,
                },
              },
        include: { subcategori: true },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Categorias, osea todas en la base de datos"})
      }
   })
   .decorate('verCategoria', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
    // if (id.length < 10 ) { return reply.status(500).send({error: "El Categoria ID No es valido"}) }        
     try {
       const Categoria = await PCategoria.findUnique({ 
         where: { id: Number(id) }, 
         include: { user: true, subcategori: true, Articulos: true },  
            }) 
        console.log(Categoria)
       if (Categoria) { return Categoria; }   
      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "no se encontro la Categoria en la base de datos"})
     }
    })
    .decorate('crearCategoria', async (request, reply) => {
      console.log(request.body)
      const data = request.body

      const {nombre, descripcion, estado, userId, catId} = data
      
      try {
        const todos = await PCategoria.create({  
          data: {
            nombre,
            descripcion,
            estado,
            userId: userId || undefined, // sets userId of Profile record
            categoriasId: catId
          },
        include: {
          user: true, // Include all posts in the returned object
          subcategori: true
        }, 
      })
   /*      const todos = await PCategoria.update({   este codigo funciona================
          where: { ...user },
          data: {
            Categoria: {
              create: { nombre, descripcion, estado},
            },
          },
        include: {
          Categoria: true, // Include all posts in the returned object
        }, 
      }) */
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La categoria en la base de datos"})
      }
    })
    .decorate('actualCategoria', async (request, reply) => { 
      const data = request.body
      let { id, nombre, descripcion, estado, userId, catId } = data
      console.log(data)
      
      const Categoria = await PCategoria.findFirst({
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
      
      if (!Categoria) { return reply.status(500).send({error: "La Categoria No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Categoria.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PCategoria.update({
          where: { id: Number(id) },
          data: {
            nombre,
            descripcion,
            estado,
            userId: userId || undefined, // sets userId of Profile record
            categoriasId: catId
          },
        include: {
          user: true, // Include all posts in the returned object
          subcategori: true
        } 
        })
         console.log("actualizado", result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar la Categoria", error)
        return reply.status(500).send({error: "no pudimos actualizar el Categoria"})
      }
    })
    .decorate('activoCategoria', async (request, reply) => { // que aqui en Activar categoria
     //  console.log(request.body)
       const { id } = request.body
      
      try {
        // const result = await Models.Categoria.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PCategoria.update({
          where: { id: Number(id) },
          data :{ 
            estado: 1
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Categoria", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Categoria"})
      }
    })
    .decorate('desactivoCategoria', async (request, reply) => {
      // console.log(request.body)
        const { id } = request.body
      
      try {
        // const result = await Models.Categoria.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PCategoria.update({
          where: { id: Number(id) },
          data :{ 
            estado: 0
          }
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el estado de la Categoria", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Categoria"})
      }
    })
    .decorate('borrarCategoria', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      
      // const Categoria = await PCategoria.findUnique({ where: { id: Number(id) } })
     // if (!Categoria) { return reply.status(500).send({error: "La Categoria No existe para Borrarlo"}) }
      
      try {
        const result = await PCategoria.delete({ where: { id: Number(id) }  })
        // console.log(result)
        return { borrado: true, nombre: result.nombre }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro la Categoria para borrar o hubo un error en la base de datos"})
      }
    })
  
    
    next()
  }
  
  module.exports = fp(categoriasCool);