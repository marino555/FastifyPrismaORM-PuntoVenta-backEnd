const multer = require('fastify-multer') // or import multer from 'fastify-multer'
const pathMas = require('path')


  // configuramos las opciones de subida de imagenes para el user en particular
  const storage = multer.diskStorage({
    destination: function (request, file, cb) {
       let { nombre } = request.user    
       let path = pathMas.join(__dirname, `/../static/users/${nombre}`)   // ${nombre}
       // console.log("todo provando: ", request.user) 
      //  console.log("imagen: ", file) 
       // console.log("path : ", path) 
      cb(null, path)  // aplicamos el path para decirle en que carpeta se va a guardar la imagen o archivo
    },
    filename: function (request, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname) // le cambiamos el nombre a la imagen para que se guarde con la fecha y nombre original
    }
  })

  function fileFilter (request, file, cb) { // primero se comprarmos que formato de imagen es, si todo sale bien seguimo adelante
   // console.log("imagen: ", file) 
    const {mimetype} = file
    if (mimetype.includes('jpeg')) {
      // To accept the file pass `true`, like so:
      return cb(null, true)
    }
   // To reject this file pass `false`, like so:
   // cb(null, false)                             tambien podemos devolver in false y seguir adelante, pero yo prefiero terminar el proceso

    // You can always pass an error if something goes wrong:
    cb(new Error('Formato de imagen invalido'))
  
  }
  
  // terminamos la configuracion y la plicamos con el storage
   const upload = multer({ fileFilter, storage: storage })

   module.exports = upload