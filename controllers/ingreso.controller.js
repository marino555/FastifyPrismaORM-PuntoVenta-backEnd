const fp = require("fastify-plugin");

async function IngresosCool(fastify, options, next) {
    
    const PIngreso = fastify.prisma.ingresos // ya con el cliente de prisma decorado, lo usamos con el modelo Ingreso de la migracion ya creada
    const { aumentarStock, disminuirStock } = fastify

    fastify.decorate('verIngresos', async (request, reply) => {

        console.log(request.query)
       const { consulta } = request.query

      try {
        const todos = await PIngreso.findMany({
          where: {
            num_comprobante: {
                  contains: consulta,
                },
              },
            include: { 
              user: true,  
              DetalleIngeso: {
                include: { articulo: true}
                    } 
                  },  
      });
         console.log(todos)
       return todos;
        
      } catch (err) {
        console.log(err)
        return reply.status(500).send({error: "no se encontro Ingresos, osea todas en la base de datos"})
      }
   })
   .decorate('verIngreso', async (request, reply) => {
     //console.log("ver el id de ruta", request.params)
     const { id } = request.params
    // if (id.length < 10 ) { return reply.status(500).send({error: "El Ingreso ID No es valido"}) }        
     try {
       const Ingreso = await PIngreso.findUnique({ 
         where: { id: Number(id) }, 
         include: { 
          user: true,  
          DetalleIngeso: {
          include: { articulo: true}
              } 
            },  
            }) 
        console.log(Ingreso)
       if (Ingreso) { return Ingreso; }   

       return reply.status(500).send({error: "no se encontro el Ingreso en la base de datos"})
       
      } catch (err) {
        
         console.log(err)
       return reply.status(500).send({error: "no se encontro la Ingreso en la base de datos"})
     }
    })
    .decorate('crearIngreso', async (request, reply) => {
      // console.log(request.body)
      const data = request.body

      const {tipo_comprobante, serie_comprobante,  num_comprobante,estado, impuesto, total, userId, personaId, DetalleIngeso } = data
      const mes = new Date().getMonth() + 1
      const ano = new Date().getFullYear()
      console.log("dato fecha: ", mes, ano)
      try {
        const todos = await PIngreso.create({  
          data: {
            tipo_comprobante,
            serie_comprobante,
            num_comprobante,
            estado,
            impuesto,
            total,
            mes,
            ano,
            userId, // sets userId of Profile record
            personaId,
            DetalleIngeso: {
              create: DetalleIngeso,
            },
          },
        include: {
          user: true, // Include all posts in the returned object
          DetalleIngeso: {
            include: { articulo: true}
          }
        }, 
      })

      if (todos) {
        // actualizar o aumentar el stock de cada articulo
       // console.log("antes de aumentarStock")
          let detalles = todos.DetalleIngeso;
          detalles.map(function(x){
            aumentarStock(x.articuloId,x.cantidad);
          });
        
      }
 
         console.log(todos)
        return todos;
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se pudo crear La Ingreso en la base de datos"})
      }
    })
    .decorate('actualIngreso', async (request, reply) => { 
      const data = request.body
      const { id, nombre, descripcion, estado, codigo, precio_venta, precio_compra, stock, userId, catId } = data
      console.log(data)
      
      const Ingreso = await PIngreso.findFirst({
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
      
      if (!Ingreso) { return reply.status(500).send({error: "La Ingreso No existe para Actualizar o esta inactiva"}) }
     undefined
      try {
        // const result = await Models.Ingreso.findByIdAndUpdate({ _id },{ ...data },{ new: true})
        const result = await PIngreso.update({
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
        console.log("no pudimos actualizar la Ingreso", error)
        return reply.status(500).send({error: "no pudimos actualizar el Ingreso"})
      }
    })
    .decorate('ingresoActivo', async (request, reply) => { // que aqui en Activar Ingreso
      // console.log(request.body)
       const { id } = request.body

       const { estado } = await PIngreso.findUnique({  where: { id: Number(id) } }) 

       if (estado == 1) {
        return reply.send({ingreso: "El ingreso ya esta activo"})
       }
      
      try {
        const result = await PIngreso.update({
          where: { id: Number(id) },
          data: {
            estado: 1
          },
          include: {
            DetalleIngeso: true
          }, 
        })

      //  console.log("actualizado activo", result)

        if (result) {
          let detalles = result.DetalleIngeso;
          detalles.map(function(x){
            aumentarStock(x.articuloId,x.cantidad);
          });  
        }

        return result

      } catch (error) {
        console.log("no pudimos actualizar el estado de la Ingreso activo", error)
        return reply.status(500).send({error: "no pudimos actualizar el estado de la Ingreso activo"})
      }
    })
    .decorate('ingresoDesactivo', async (request, reply) => {
     // console.log(request.body)
      const { id } = request.body

      const { estado } = await PIngreso.findUnique({  where: { id: Number(id) } }) 

      if (estado == 0) {
       return reply.send({ingreso: "El ingreso ya esta Desactivo"})
      }
     
     try {
       const result = await PIngreso.update({
         where: { id: Number(id) },
         data: {
           estado: 0
         },
         include: {
          DetalleIngeso: true
        }, 
       })

      // console.log("actualizado desactivo", result)

       if (result) {
         let detalles = result.DetalleIngeso;
         detalles.map(function(x){
          disminuirStock(x.articuloId,x.cantidad);
         });  
       }

       return result

     } catch (error) {
       console.log("no pudimos actualizar el estado de la Ingreso desactivo", error)
       return reply.status(500).send({error: "no pudimos actualizar el estado de el Ingreso desactivo"})
     }
    })
    .decorate('borrarIngreso', async (request, reply) => {
      // console.log(request.params)
      const { id } = request.params
      try {
        const { estado } = await PIngreso.findUnique({  where: { id: Number(id) } }) 
        if (estado == 1) { return reply.send({ingreso: "El ingreso debe de estar Desactivo para poderlo borrar"}) }
         
        const update = await PIngreso.update({
          where: { id: Number(id) },
          data: {
            DetalleIngeso: {
              deleteMany: {},
            },
          },
        })
       // console.log("antes de borrar", update)
        const result = await PIngreso.delete({ where: { id: Number(id) }  })
        // console.log("ya borrado", result)
        return { borrado: true, nombre: result.num_comprobante }
        
      } catch (error) {
        console.log(error)
        return reply.status(500).send({error: "no se encontro el Ingreso para borrar o hubo un error en la base de datos"})
      }
    })
    .decorate('graficoIngre12meses', async () => {
     // console.log("en grafico 12 mese")
      
      try {
       const result = await PIngreso.groupBy({
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
    .decorate('verFechasIngreso', async (request, respont) => {  // ver todas las Ingreso // para que un campo no aparesca usamos la propiedad .project({ nombre: 0 })
      // console.log("ver fecha: ", request.query)
       const { empiesa } = request.query
       const { termina } = request.query

       const inicio = new Date(empiesa)
       const fin = new Date(termina)
      // console.log("ver cool: ", inicio, fin)
           try {
            const result = await PIngreso.findMany({
              where: {
                AND: [
                  {  createdAt: { gte: inicio } },
                  { createdAt: { lte: fin }  }
                ]
                    },
              include: { 
                user: { select: { id: true, nombre: true, email: true,  role: true,  estado: true }  }, 
                persona: true, 
                DetalleIngeso: {
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
  
  module.exports = fp(IngresosCool);