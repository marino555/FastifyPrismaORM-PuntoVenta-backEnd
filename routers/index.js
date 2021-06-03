module.exports = function(fastify, options, next) {

    fastify.register(require('./users'))
    fastify.register(require('./categorias'))
    fastify.register(require('./articulos'))
    
    next()
    
    }
