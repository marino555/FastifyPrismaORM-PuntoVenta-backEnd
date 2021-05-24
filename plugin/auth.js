const fp = require("fastify-plugin");

async function authCool(fastify, options, next) {
  fastify.register(require("fastify-jwt"), {
    secret: "MarinoSecret",
    sign: {
      expiresIn: "7d", // '2m' para crear token de minutos
    },
  });

  const { bcrypt, prisma } = fastify;

  fastify
    .decorate("verificarUser", async (userCool, reply) => {
      const { email, pass } = userCool;
// si estado es 1 el user esta activo.... pero si es 0 esta inactivo y no se va a encontrar
      const user = await prisma.user.findFirst({ 
        where: {
          email: {
            contains: email,
          },
          estado: {
            equals: 1,
          },
        },
      });
     // console.log(user);
      if (!user) return reply.status(500).send({error: "no encontramos al email o esta inactivo"});
// aqui compramos la contrasena con el hash para verificar si la contra es validad
      const hashed = user.pass;
      const confirmo = await bcrypt.compare(pass, hashed); 
      console.log("verificar contra:", confirmo); // si es validad saldra true, si es falsa saldra, false

      if (!confirmo)  return reply.status(500).send({error: "La contrasena NO es correcta"});
// con esta info, es que vamos a general el token
      const todo = {}; 
      todo.id = user.id;
      todo.nombre = user.nombre;
      todo.role = user.role;
      todo.email = user.email;

      const token = await fastify.jwt.sign(todo); // aqui generamos el token
      const tokenCool = `Bearer ${token}`

      return { user, tokenCool };
    });

  next();
}

module.exports = fp(authCool);
