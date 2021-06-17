// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Ventas(fastify, options, done) {
  const f = fastify

  f.get('/ventas', f.getVentas, f.verVentas)
  // rutas unitarias
  f.get('/venta/:id', f.getVenta, f.verVenta)
  f.post('/venta', f.postVenta, f.crearVenta)
   f.get('/ventas12meses', f.getVentaGrafico, f.graficoVenta12meses)
   f.get('/ventasxfechas', f.getVentaFecha, f.verFechasVentas)


 // f.put('/ventas', f.putVentas, f.actualVentas)
 f.put('/venta/activo', f.putVentaActivo, f.VentasActivo)
 f.put('/venta/desactivo', f.putVentaDesactivo, f.VentasDesactivo)
 
 f.delete('/venta/:id', f.delVenta, f.borrarVenta)
  done()
}

module.exports = Ventas