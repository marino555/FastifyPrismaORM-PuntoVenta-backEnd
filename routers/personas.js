// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Personas(fastify, options, done) {
  const f = fastify
    
  f.get('/personas', f.getPersonas, f.verPersonas)
  f.get('/clientes', f.getClientes, f.verClientes)
  f.get('/proveedores', f.getProveedores, f.verProveedores)
  // rutas unitarias
  f.post('/persona', f.postPersona, f.crearPersona)
  f.get('/persona/:id', f.getPersona, f.verPersona)
  f.put('/persona', f.putPersona, f.actualPersona)
  f.delete('/persona/:id', f.delPersona, f.borrarPersona)
  f.put('/persona/activo', f.putPersonaActivo, f.activoPersona) 
  f.put('/persona/desactivo', f.putPersonaDesactivo, f.desactivoPersona) 
   
  
    done()
  }
  
  module.exports = Personas