"use strict";
require("make-promises-safe"); // installs an 'unhandledRejection' handler

// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient()

const fastify = require("fastify")({
  logger: true,
});
fastify.register(require('fastify-routes'))

// plugin
fastify.register(require('fastify-auth')) 
fastify.register(require('fastify-bcrypt'));
// mis Plugin
fastify.register(require('./plugin/prisma-fastify'))
fastify.register(require("./plugin/auth"));
fastify.register(require("./plugin/verifyRules"));
fastify.register(require("./plugin/helpers"));

// // models de las bases de datos
// fastify.register(require("./models/users.model"));

// schemas
fastify.register(require("./schema/users.schema"))
fastify.register(require("./schema/categorias.schema"))
fastify.register(require("./schema/articulos.schema"))
fastify.register(require("./schema/personas.schema"))
fastify.register(require("./schema/ingresos.schema"))

// controladores
fastify.register(require("./controllers/users.controller"))
fastify.register(require("./controllers/categorias.controller"))
fastify.register(require("./controllers/articulos.controller"))
fastify.register(require("./controllers/personas.controller"))
fastify.register(require("./controllers/ingreso.controller"))

      .after(() => {
        //rutas
        fastify.register(require("./routers/index"));

        fastify.get("/", async (request, reply) => {
          return { hello: "world, marino el mejor" };
        });
        // fastify.get("/mas", async (request, reply) => {
        //   const todos = await prisma.user.findMany();

        //   return { datos: todos };
        // });

 });


const port = process.env.PORT || 8085;

const start = async () => {
  try {
    await fastify.listen(port);
    // console.log(fastify.routes)
     // console.log('maximo', fastify.swagger)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();