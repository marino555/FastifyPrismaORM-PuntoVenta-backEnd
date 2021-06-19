const fp = require("fastify-plugin");

async function VentasCool(fastify, options, next) {
    
    const PVentas = fastify.prisma.ventas // ya con el cliente de prisma decorado, lo usamos con el modelo Ventas de la migracion ya creada
    const { aumentarStock, disminuirStock } = fastify

    fastify.decorate('verVentas', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

      try {
        const todos = await PVentas.findMany({
          where: {
            num_comprobante: {
                  contains: consulta,
                },
              },
            include: { 
              user: true,  
              DetalleVenta: {
                include: { articulo: true}
                    } 
                  },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Ventas, osea todas las ventas en la base de datos"})
      }
   })
   .decorate('verVenta', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
    // if (id.length < 10 ) { return reply.status(500).send({error: "El Ventas ID No es valido"}) }        
     try {
       const Ventas = await PVentas.findUnique({ 
         where: { id: Number(id) }, 
         include: { 
          user: true,  
          DetalleVenta: {
          include: { articulo: true}
              } 
            },  
            }) 
        console.log(Ventas)
       if (Ventas) { return Ventas; }   

       return reply.status(500).send({error: "no se encontro el Ventas en la base de datos"})
       
      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "no se encontro la Ventas en la base de datos"})
     }
    })
    .decorate('crearVenta', async (request, reply) => {
      // console.log(request.body)
      const data = request.body

      const {tipo_comprobante, serie_comprobante,  num_comprobante,estado, impuesto, total, descuento, userId, personaId, DetalleVenta } = data
      const mes = new Date().getMonth() + 1
      const ano = new Date().getFullYear()
      console.log("dato fecha: ", mes, ano)
      try {
        const todos = await PVentas.create({  
          data: {
            tipo_comprobante,
            serie_comprobante,
            num_comprobante,
            estado,
            impuesto,
            total,
            descuento,
            mes,
            ano,
            userId, // sets userId of Profile record
            personaId,
            DetalleVenta: {
              create: DetalleVenta,
            },
          },
        include: {
          user: true, // Include all posts in the returned object
          DetalleVenta: {
            include: { articulo: true}
          }
        }, 
      })

      if (todos) {
        // actualizar o aumentar el stock de cada articulo
       // console.log("antes de aumentarStock")
          let detalles = todos.DetalleVenta;
          detalles.map(function(x){
            disminuirStock(x.articuloId,x.cantidad);
          });
        
      }
 
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La Ventas en la base de datos"})
      }
    })
    .decorate('actualVentas', async (request, reply) => { 
      const data = request.body
      const { id, nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      console.log(data)
      
      const Ventas = await PVentas.findFirst({
        where: {
          AND: [
            {
              id: Number(id)              
            },
            {
              estado: {
                equals: 1,
              },
            },
          ],
        },
      })
      
      if (!Ventas) { return reply.status(500).send({error: "La Ventas No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Ventas.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PVentas.update({
          where: { id: Number(id) },
          data: {
            nombre,
            descripcion,
            estado,
            codigo,
            precio_venta,
            precio_compra,
            stock,
            userId: userId || undefined, // sets userId of Profile record
            catId: catId
          },
        include: {
          user: true, // Include all posts in the returned object
          categoria: true
        }, 
        })
         console.log("actualizado", result)
        return result
        
      } catch (error) {
        console.log("no pudimos actualizar la Ventas", error)
        return reply.status(500).send({error: "no pudimos actualizar el Ventas"})
      }
    })
    .decorate('VentasActivo', async (request, reply) => { // que aqui en Activar Ventas
      // console.log(request.body)
       const { id } = request.body

       const { estado } = await PVentas.findUnique({  where: { id: Number(id) } }) 

       if (estado == 1) {
        return reply.send({Ventas: "El Ventas ya esta activo"})
       }
      
      try {
        const result = await PVentas.update({
          where: { id: Number(id) },
          data: {
            estado: 1
          },
          include: {
            DetalleVenta: true
          }, 
        })

      //  console.log("actualizado activo", result)

        if (result) {
          let detalles = result.DetalleVenta;
          detalles.map(function(x){
            disminuirStock(x.articuloId,x.cantidad);
          });  
        }

        return result

      } catch (error) {
        console.log("no pudimos actualizar el estado de la Ventas activo", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Ventas activo"})
      }
    })
    .decorate('VentasDesactivo', async (request, reply) => {
     // console.log(request.body)
      const { id } = request.body

      const { estado } = await PVentas.findUnique({  where: { id: Number(id) } }) 

      if (estado == 0) {
       return reply.send({Ventas: "El Ventas ya esta Desactivo"})
      }
     
     try {
       const result = await PVentas.update({
         where: { id: Number(id) },
         data: {
           estado: 0
         },
         include: {
          DetalleVenta: true
        }, 
       })

      // console.log("actualizado desactivo", result)

       if (result) {
         let detalles = result.DetalleVenta;
         detalles.map(function(x){
          aumentarStock(x.articuloId,x.cantidad);
         });  
       }

       return result

     } catch (error) {
       console.log("no pudimos actualizar el estado de la Ventas desactivo", error)
       return reply.status(500).send({error: "no pudimos actualizar el estado de el Ventas desactivo"})
     }
    })
    .decorate('borrarVenta', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      try {
        const { estado } = await PVentas.findUnique({  where: { id: Number(id) } }) 
        if (estado == 1) { return reply.send({Ventas: "El Ventas debe de estar Desactivo para poderlo borrar"}) }
         
        const update = await PVentas.update({
          where: { id: Number(id) },
          data: {
            DetalleVenta: {
              deleteMany: {},
            },
          },
        })
       // console.log("antes de borrar", update)
        const result = await PVentas.delete({ where: { id: Number(id) }  })
        // console.log("ya borrado", result)
        return { borrado: true, nombre: result.tipo_comprobante }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro el Ventas para borrar o hubo un error en la base de datos"})
      }
    })
    .decorate('graficoVenta12meses', async () => {
     // console.log("en grafico 12 mese")
      
      try {
       const result = await PVentas.groupBy({
          by: ['ano', 'mes'],          
          _sum: {
            total: true
          },
          _count: {
            _all: true,
          },
          orderBy: [
            {
              ano: 'desc',
            },
            {
              mes: 'desc',
            },
          ],
          take: 12,
        })

     //   console.log("grafico ventas: " + result) 

        return result

    } catch(e){
           console.log(e)
        return reply.status(500).send({error: "ocurrio un error con los datos del grafico"})
     }
    })
    .decorate('verFechasVentas', async (request, respont) => {  // ver todas las Ventas // para que un campo no aparesca usamos la propiedad .project({ nombre: 0 })
      // console.log("ver fecha: ", request.query)
       const { empiesa } = request.query
       const { termina } = request.query

       const inicio = new Date(empiesa)
       const fin = new Date(termina)
      // console.log("ver cool: ", inicio, fin)
           try {
            const result = await PVentas.findMany({
              where: {
                AND: [
                  {  createdAt: { gte: inicio } },
                  { createdAt: { lte: fin }  }
                ]
                    },
              include: { 
                user: { select: { id: true, nombre: true, email: true,  role: true,  estado: true }  }, 
                persona: true, 
                DetalleVenta: {
                include: { articulo: true}
                    } 
                  },  
             })   
            // console.log("grafico ventas: " + result)     
             return result
     
         } catch(e){
                console.log(e)
             return reply.status(500).send({error: "ocurrio un error con los datos del rango de fecha que buscas"})
          }
 })
  
    
    next()
  }
  
  module.exports = fp(VentasCool);