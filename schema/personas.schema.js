const fp = require("fastify-plugin");

async function decoraCat(fastify, options, next) {

  const schemagetPersonas = {
    ...getPersonas, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetClientes = {
    ...getClientes, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetProveedores = {
    ...getProveedores, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetPersona = {
    ...getPersona, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemapostPersona = {
    ...postPersona, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemaputPersona = {
    ...putPersona, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemadelPersona = {
    ...delPersona, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputPersonaActivo = {
    ...putPersonaActivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputPersonaDesactivo = {
    ...putPersonaDesactivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  

    fastify.decorate('getPersonas', schemagetPersonas )
    fastify.decorate('getProveedores', schemagetProveedores )
    fastify.decorate('getClientes', schemagetClientes )
    fastify.decorate('getPersona', schemagetPersona )
    fastify.decorate('postPersona', schemapostPersona )
    fastify.decorate('putPersona', schemaputPersona )
    fastify.decorate('delPersona', schemadelPersona )
    fastify.decorate('putPersonaActivo', schemaputPersonaActivo )
    fastify.decorate('putPersonaDesactivo', schemaputPersonaDesactivo )
    

next()
}
module.exports = fp(decoraCat);


const seguridad = {
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const ResPersona = {
  id: { type: "number" },
  nombre: { type: "string" },
  email: { type: "string" },
  estado: { type: "number" },
  tipo_persona: { type: "string" },
  tipo_documento: { type: "string" },
  num_documento: { type: "string" },
  direccion: { type: "string" },
  telefono: { type: "string" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
  userId: { type: "number" },

}


const getPersonas = {
  schema: {
    tags: ["Personas"],
    description: "ver todas las Personas",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una Persona por el nombre o por el num_documento, si se deja en blanco traera todas las Personas' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: ResPersona
        },
      },
    },
  },
};
const getClientes = {
  schema: {
    tags: ["Personas"],
    description: "ver todos los clientes",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una Persona por el nombre o por el num_documento, si se deja en blanco traera todas las Personas' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: ResPersona
        },
      },
    },
  },
};
const getProveedores = {
  schema: {
    tags: ["Personas"],
    description: "ver todos los proveedores",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una Persona por el nombre o por el num_documento, si se deja en blanco traera todas las Personas' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: ResPersona
        },
      },
    },
  },
};

const getPersona = {
  schema: {
    tags: ["Personas"],
    description: "ver una sola Persona masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para buscar una unica Persona'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: ResPersona
      },
    },
  },
};

const postPersona = {
  schema: {
    tags: ["Personas"],
    description: "introducir una sola Persona",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        nombre: { type: "string", maxLength: 50 },
        email: { type: "string", maxLength: 50 },
        estado: { type: "number", default: 1, enum: [ 1, 0], description: 'el estado solo puede ser 1 o 0' },
        tipo_persona: { type: "string", default: "CLIENTE", enum: [ "CLIENTE", "PROVEEDOR"], description: 'el tipo_persona solo puede ser CLIENTE o PROVEEDOR' },
        tipo_documento: { type: "string", default: "CEDULA", enum: [ "CEDULA", "PASSAPORTE"], description: 'el tipo_DOCUMENTO solo puede ser CEDULA o PASSAPORTE' },
        num_documento: { type: "string", maxLength: 50},
        direccion: { type: "string", maxLength: 150},
        telefono: { type: "string", maxLength: 20},
       
        userId: { type: "number" },
      },
      required: ["nombre"],
    },
    response: {
      200: {
        type: "object",
        properties: ResPersona
      },
    },
  },
};

const putPersona = {
  schema: {
    tags: ["Personas"],
    description: "actualizar una sola Persona",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "number" },
        nombre: { type: "string", maxLength: 50 },
        email: { type: "string", maxLength: 50 },
        estado: { type: "number", default: 1, enum: [ 1, 0], description: 'el estado solo puede ser 1 o 0' },
        tipo_persona: { type: "string", default: "CLIENTE", enum: [ "CLIENTE", "PROVEEDOR"], description: 'el tipo_persona solo puede ser CLIENTE o PROVEEDOR' },
        tipo_documento: { type: "string", default: "CEDULA", enum: [ "CEDULA", "PASSAPORTE"], description: 'el tipo_DOCUMENTO solo puede ser CEDULA o PASSAPORTE' },
        num_documento: { type: "string", maxLength: 50},
        direccion: { type: "string", maxLength: 150},
        telefono: { type: "string", maxLength: 20},
       
        userId: { type: "number" },

      },
    },
    response: {
      200: {
        type: "object",
        properties:ResPersona
      },
    },
  },
};

const delPersona = {
  schema: {
    tags: ["Personas"],
    description: "borrar una sola Persona",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para Borrar una unica Persona'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          borrado: { type: "boolean" },
          nombre: { type: "string" }
        },
      },
    },
  },
};
const putPersonaActivo = {
  schema: {
    tags: ["Personas"],
    description: "actualizar el estado de una sola Persona",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Persona' },
        estado: { type: "number", enum: [1], description: 'el estado solo para activar Persona' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResPersona
      },
    },
  },
};

const putPersonaDesactivo = {
  schema: {
    tags: ["Personas"],
    description: "actualizar el estado de una sola Persona",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Persona' },
        estado: { type: "number", enum: [0], description: 'el estado solo para desactivar' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResPersona
      },
    },
  },
};