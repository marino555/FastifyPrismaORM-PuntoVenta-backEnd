const fp = require("fastify-plugin");

async function helpers(fastify, options, next) {

  const PArticulo = fastify.prisma.articulos // ya con el cliente de prisma decorado, lo usamos con el modelo Ingreso de la migracion ya creada

  
  fastify.decorate('aumentarStock', async (idarticulo, cantidad) => { 
    const Articulo = await PArticulo.findFirst({ where: { id: Number(idarticulo) } })
    if (!Articulo) { return {error: "El Articulo No existe para Actualizar o esta inactiva"} }

    const newStock = Articulo.stock + cantidad
    try {
      const result = await PArticulo.update({
        where: { id: Number(idarticulo) },
        data: {
          stock: newStock
        },
   /*    include: {
        user: true, // Include all posts in the returned object
        categoria: true
      },  */
      })
      // console.log("actualizado", result)
      return result
      
    } catch (error) {
      console.log(error)
        return {error: "no se pudo actualizar el stock en base de datos"}
    }
        })
  .decorate('disminuirStock', async (idarticulo, cantidad) => { 
    const Articulo = await PArticulo.findFirst({ where: { id: Number(idarticulo) } })
    if (!Articulo) { return {error: "La Articulo No existe para Actualizar o esta inactiva"} }

    const newStock = Articulo.stock - cantidad
    try {
      const result = await PArticulo.update({
        where: { id: Number(idarticulo) },
        data: {
          stock: newStock
        },
    /*   include: {
        user: true, // Include all posts in the returned object
        categoria: true
      },  */
      })
      // console.log("actualizado", result)
      return result
      
    } catch (error) {
      console.log(error)
        return {error: "no se pudo actualizar el stock en base de datos"}
    }
   })


  next()
}

module.exports = fp(helpers);