const fp = require("fastify-plugin");

async function verifyCool(fastify, options, next) {
 
  const { prisma } = fastify;

  fastify.decorate("verifyToken", async function(request, reply) {
     
    try {
     // console.log("cool papa en auth funcion registrado");
      const mas = await request.jwtVerify();
      // console.log("marinooo", mas)

    } catch (err) {
      console.log(err)
      reply.status(401).send({err, error: "paso un percanse y no podemos continuar, token invalido o algo paso"})
    }
  })
  .decorate("verifyExistingUser", async function(request, reply) {

    const { email } = request.body
     
    try {
      console.log("cool papa verificando user haber si existe");
     const user = await prisma.user.findUnique({ where: { email } }) 
     // console.log(user)
      // console.log("marinooo", mas)
      if (user) return reply.status(403).send({ error: "ya el usuario existe en la base de datos"})

    } catch (err) {
      console.log(err)
      reply.status(500).send({err, error: "paso un percanse y no podemos continuar con la busqueda del user en la base de datos"})
    }
  })
// verificamos todos los roles ==============================================
// para tener mar seguridad deberiamos buscar en la base de datos al user y comprar sus roles y sus estados,
// pero no lo hacemos por que eso consume recurso y tiempo en la base de datos

  .decorate("verifyTodoRoles", async function(request, reply) {

    console.log("estoy en flujo todos")
    console.log(request.user)
    const { role } = request.user
    const { estado } = request.user

    if (estado === 0) { return reply.status(403).send({ message: 'Este User NO esta Activado' }) };
    if (role =='ADMIN' || role == 'VENTOR' || role =='SUPERADMIN') { return }
    else { return reply.status(403).send({ message: 'No autorizado no TIENES ROLE' }) };

  })
 .decorate("verifySuperAdmin", async function(request, reply) {

    console.log("estoy en flujo SUPERADMIN")
    console.log(request.user)
    const { role } = request.user
    const { estado } = request.user

    if (estado === 0) { return reply.status(403).send({ message: 'Este User NO esta Activado' }) };
    if (role !== 'SUPERADMIN') { return reply.status(403).send({ message: 'No autorizado no es SUPERADMIN' }) };
      
     
  })
  .decorate("verifyAdmin", async function(request, reply) {

    console.log("estoy en flujo ADMIN")
      console.log(request.user)
      const { role } = request.user
      const { estado } = request.user
  
      if (estado === 0) { return reply.status(403).send({ message: 'Este User NO esta Activado' }) };
      if (role == 'ADMIN' || role == 'SUPERADMIN') { return }
      else { return reply.status(403).send({ message: 'No autorizado no es ADMIN' }) };

  })
  .decorate("verifyVentor", async function(request, reply) {

    console.log("estoy en flujo VENTOR")
    console.log(request.user)
    const { role } = request.user
    const { estado } = request.user

    if (estado === 0) { return reply.status(403).send({ message: 'Este User NO esta Activado' }) };
    if (role =='VENTOR' || role =='SUPERADMIN') { return }
    else { return reply.status(403).send({ message: 'No autorizado no es VENTOR' }) };

  })


  next();
}

module.exports = fp(verifyCool);
