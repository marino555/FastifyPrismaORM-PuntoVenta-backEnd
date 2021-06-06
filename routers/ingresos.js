// las funciones f.getUser y demas vienen de la carpeta schema y las segundas funciones de f.verUser vienen de la carpeta controllers
// decoramos el objeto de fastify para tener mayor rapidez
function Ingresos(fastify, options, done) {
  const f = fastify

  f.get('/ingresos', f.getIngresos, f.verIngresos)
  // rutas unitarias
  f.post('/ingreso', f.postIngreso, f.introIngreso)
  f.get('/ingreso/:id', f.getIngreso, f.verIngreso)
  f.get('/ingresos12meses', f.getIngresoGrafico, f.graficoIngre12meses)
  f.get('/ingresosxfechas', f.getIngresoFecha, f.verFechasIngreso)


  /* f.put('/ingreso', f.putIngreso, f.actualIngreso)
  f.delete('/ingreso/:id', f.delIngreso, f.borrarIngreso) */

  f.put('/ingreso/estado', f.putIngresoEstado, f.actualEstadoIngreso)

  done()
}

module.exports = Ingresos