module.exports = function(fastify, options, next) {

    fastify.register(require('./users'))
    
    next()
    
    }
