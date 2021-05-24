const fp = require("fastify-plugin");
// const { upload } = require("./imagenSubir")


async function decoraUser(fastify, options, next) {

  const { verifyExistingUser, verifyToken } = fastify

  const schemaGetUser = {
    ...getUser, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifysuperAdmin],{relation: "or"}) 
  }
  const schemaPosUser = {
    ...postUser, 
    preHandler: fastify.auth([verifyExistingUser]) 
    }
  const schemaPutUser = {
    ...putUser, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifysuperAdmin],{relation: "and"}) 
    }
  const schemaDelUser = {
    ...delUser, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifysuperAdmin],{relation: "and"}) 
    }  
/* const schemaPutUserEstado = {
    ...putUserEstado, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifysuperAdmin],{relation: "and"}) 
    }  
 */
// const schemaUserImagen = {
//     ...userImagen, 
//     preValidation: fastify.auth([fastify.registrado, fastify.verifysuperAdmin],{relation: "or"}),
//     preHandler: upload.single('cool') 
//     }  
const schemaRestringido = {
    ...userRestringido, 
    // preValidation: fastify.auth([fastify.verifyToken]),
     preHandler: fastify.auth([verifyToken])
    }  

    fastify.decorate('getUsers', getUsers )
    fastify.decorate('getUser', schemaGetUser )
    fastify.decorate('postUser', schemaPosUser )
    fastify.decorate('putUser', schemaPutUser )
    fastify.decorate('delUser', schemaDelUser )
    /* fastify.decorate('putUserEstado', schemaPutUserEstado ) */
    fastify.decorate('postLogin', postLogin )
    fastify.decorate('userRestringido', schemaRestringido )
    
   // fastify.decorate('userImagen', schemaUserImagen )

next()
}
module.exports = fp(decoraUser);



const resCool = {
    type: "object",
    properties: {
      id: { type: "string" },
      role: { type: "string" },
      nombre: { type:"string"},
      email: { type:"string"},
      pass: { type:"string"},
    //   tipo_documento: { type:"string"},
    //   num_documento: { type:"string"},
    //   direccion: { type:"string"},
    //   telefono: { type:"string"},
      estado: { type: "number" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
     // directorio: { type:"string"}
    },
  }
  
const seguridad = {
  security: [
    {
      bearerAuth: [],
    },
  ],
};



const getUsers = {
  schema: {
    tags: ["Users"],
    description: "ver todas las Users",
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar por el nombre, si se deja en blanco traera todas las Users' },
    },
    response: {
      200: { 
        type: "array",
        items: resCool
    }
    },
  },
};

const getUser = {
  schema: {
    tags: ["Users"],
    description: "ver un solo User masss",
    ...seguridad,
     additionalProperties: false,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'string',
          minLength: 10,
          description: 'el ID es necesario para buscar un unico User'
        }
      }
    },
    response: {
      200: resCool
    },
  },
};

const postUser = {
  schema: {
    tags: ["Users"],
    description: "introducir un solo User",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxlength:30, enum: ["VENTOR","ADMIN", "SUPERADMIN"] },
        nombre: { type:"string", maxLength: 50},
        email: { type:"string", maxlength:50},
        pass: { type:"string", maxlength:90 },
        // tipo_documento: { type:"string", maxlength:20},
        // num_documento: { type:"string",maxlength:20},
        // direccion: { type:"string",maxlength:40},
        // telefono: { type:"string",maxlength:20},
        estado: { type: "number", default: 1, enum: [ 1, 0] }
      },
      required: ["nombre", "role", "email", "pass"],
    },
    response: {
      200: resCool
    },
  },
};

const putUser = {
  schema: {
    tags: ["Users"],
    description: "actualizar un solo User",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "string" },
        role: { type: "string", maxlength:30, enum: ["VENTOR","ADMIN", "SUPERADMIN"]},
        nombre: { type:"string", maxLength: 50},
        email: { type:"string", maxlength:50},
        pass: { type:"string", maxlength:90 },
        // tipo_documento: { type:"string", maxlength:20},
        // num_documento: { type:"string",maxlength:20},
        // direccion: { type:"string",maxlength:40},
        // telefono: { type:"string",maxlength:20},
        estado: { type: "number", enum: [ 1, 0] }
      },
    },
    response: {
      200: resCool
    },
  },
};

const delUser = {
  schema: {
    tags: ["Users"],
    description: "borrar una sola User",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: { type: 'string', minLength: 10, description: 'el ID es necesario para Borrar una unica User' }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          borrado: { type: "boolean" },
          nombre: {type:"string"}
        },
      },
    },
  },
};
/* const putUserEstado = {
  schema: {
    tags: ["Users"],
    description: "actualizar el estado de una sola User",
    ...seguridad,
    body: {
      required: ["_id"],
      additionalProperties: false,
      type: "object",
      properties: {
        _id: { type: "string", description: 'el ID es necesario para actualizar el estado de una User' },
        estado: { type: "number", enum: [ 1, 0], description: 'el estado solo puede ser 1 o 0' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          estado: { type: "number" },
          updated_at: { type: "string" },
        },
      },
    },
  },
};
 */
const postLogin = {
  schema: {
    tags: ["Users"],
    description: "introducir un User para login",
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        email: { type:"string", maxlength:50},
        pass: { type:"string", maxlength:90 }
      },
      required: ["email", "pass"],
    },
    response: {
      200:  {
        type: "object",
        properties: {
          user: resCool,
          tokenCool: { type: "string" }
        },
      },
    },
  },
};

const userRestringido = {
  schema: {
    tags: ["Restringido"],
    description: "para aceder aqui, tienes que tener un token de autorizacion",
    headers: {
      type: "object",
      properties: {
         Authorization: { type: 'string' },
      },
     required: ["Authorization"],
    },
    ...seguridad,
  }
};
