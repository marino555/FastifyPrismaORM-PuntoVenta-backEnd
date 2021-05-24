
function Users(fastify, options, done) {
  const f = fastify
    
    f.get('/users/', f.getUsers, f.verUsers)
    f.get('/user/:id', f.getUser, f.verUser)
    f.post('/user/', f.postUser, f.crearUser)
    f.put('/user/', f.putUser, f.actualUser)
    f.delete('/user/:id', f.delUser, f.borrarUser)

    f.post('/login/', f.postLogin, f.login)
    f.get('/protejida/', f.userRestringido, f.protejida)
   
  
    done()
  }
  
  module.exports = Users