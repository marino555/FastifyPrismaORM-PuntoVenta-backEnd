// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Users(fastify, options, done) {
  const f = fastify
    
    f.get('/users', f.getUsers, f.verUsers)
    f.get('/user/:id', f.getUser, f.verUser)
    f.post('/user', f.postUser, f.crearUser)
    f.put('/user', f.putUser, f.actualUser)
    f.delete('/user/:id', f.delUser, f.borrarUser)
    
    f.put('/user/activo', f.putUserActivo, f.estadoActivo)
    f.put('/user/desactivo', f.putUserDesactivo, f.estadoDesactivo)

    f.post('/login', f.postLogin, f.login)
    f.get('/protejida', f.userRestringido, f.protejida)
   
  
    done()
  }
  
  module.exports = Users