module.exports = function(fastify, options, next) {

    fastify.register(require('./users'))
    fastify.register(require('./categorias'))
    fastify.register(require('./articulos'))
    fastify.register(require('./personas'))
    fastify.register(require('./ingresos'))
    fastify.register(require('./ventas'))
    
    next()
    
    }
