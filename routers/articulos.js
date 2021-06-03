// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Articulos(fastify, options, done) {
  const f = fastify
    
  f.get('/articulos', f.getArticulos, f.verArticulos)
  // rutas unitarias
  f.post('/articulo', f.postArticulo, f.crearArticulo)
  f.get('/articulo/:id', f.getArticulo, f.verArticulo)
  f.put('/articulo', f.putArticulo, f.actualArticulo)
  f.delete('/articulo/:id', f.delArticulo, f.borrarArticulo)
  f.put('/articulo/activo', f.putArticuloActivo, f.activoArticulo) 
  f.put('/articulo/desactivo', f.putArticuloDesactivo, f.desactivoArticulo) 
   
  
    done()
  }
  
  module.exports = Articulos