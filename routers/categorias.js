// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Users(fastify, options, done) {
  const f = fastify
    
  f.get('/categorias', f.getCategorias, f.verCategorias)
  // rutas unitarias
  f.post('/categoria', f.postCategoria, f.crearCategoria)
  f.get('/categoria/:id', f.getCategoria, f.verCategoria)
  f.put('/categoria', f.putCategoria, f.actualCategoria)
  f.delete('/categoria/:id', f.delCategoria, f.borrarCategoria)
  f.put('/categoria/activo', f.putCategoriaActivo, f.activoCategoria) 
  f.put('/categoria/desactivo', f.putCategoriaDesactivo, f.desactivoCategoria) 
   
  
    done()
  }
  
  module.exports = Users