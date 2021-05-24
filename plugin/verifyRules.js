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


  next();
}

module.exports = fp(verifyCool);
