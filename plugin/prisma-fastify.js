const fp = require("fastify-plugin");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function prismaCool(fastify, options, next) {
  
    fastify.decorate('prisma', prisma)


  next()
}

module.exports = fp(prismaCool);