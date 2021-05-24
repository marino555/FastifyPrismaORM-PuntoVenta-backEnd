const fp = require("fastify-plugin");


async function UsersCool(fastify, options, next) {
    
    const PUser = fastify.prisma.user // ya con el cliente de prisma decorado, lo usamos con el modelo user de la migracion ya creada
    const { bcrypt } = fastify

    fastify.decorate('verUsers', async (request, reply) => {
        const todos = await PUser.findMany();
       return todos;
   })
   .decorate('verUser', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
     if (id.length < 10 ) { return reply.status(500).send({error: "El user ID No es valido"}) }        
     
     const user = await PUser.findUnique({ where: { id: String(id) } }) 
     // console.log(user)
     if (user) { return user; }   
     return reply.status(500).send({error: "no se encontro el user en la base de datos"})
    })
    .decorate('crearUser', async (request, reply) => {
      // console.log(request.body)
      const data = request.body
      data.pass = await bcrypt.hash(data.pass)
      
      try {
        const todos = await PUser.create({ data })
        // console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear el Usuario en la base de datos"})
      }
    })
    .decorate('actualUser', async (request, reply) => {
      // console.log(request.body)
      const data = request.body
      let { id } = data
      
      const user = await PUser.findUnique({
        where: {
          id: String(id),
        }
      })
      
      if (!user) { return reply.status(500).send({error: "El user No existe para Actualizar"}) }
      
      if (data.pass) {
        data.pass = await bcrypt.hash(data.pass)
      }
      
      try {
        // const result = await Models.User.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PUser.update({
          where: { id: String(id) },
          data
        })
        // console.log(result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar el user", error)
        return reply.status(500).send({error: "no pudimos actualizar el user"})
      }
    })
    .decorate('borrarUser', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      
      if (id.length < 10 ) { return reply.status(500).send({error: "El user ID No es valido para Borrarlo"}) }
      
      const user = await PUser.findUnique({ where: { id: String(id) } })
      
      if (!user) { return reply.status(500).send({error: "El user No existe para Borrarlo"}) }
      
      try {
        const result = await PUser.delete({ where: { id: String(id) }  })
        // console.log(result)
        return { borrado: true, nombre: result.nombre }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro el user para borrar"})
      }
    })
    .decorate('login', async (request, reply) => {    // login
      let user = request.body      
      // console.log(user)
      try {
        const result = await fastify.verificarUser(user, reply)
        // console.log(result)
        return result
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "El User No esta en la base de datos"})
      }
    })
    fastify.decorate('protejida', async (request, reply) => {
      // console.log(request.user)
       const { user } = request
       return {dato: "area protejida", user}
   })
    
    
    next()
  }
  
  module.exports = fp(UsersCool);