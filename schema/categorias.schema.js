const fp = require("fastify-plugin");

async function decoraCat(fastify, options, next) {

  const schemagetCategorias = {
    ...getCategorias, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetCategoria = {
    ...getCategoria, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemapostCategoria = {
    ...postCategoria, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemaputCategoria = {
    ...putCategoria, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemadelCategoria = {
    ...delCategoria, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputCategoriaActivo = {
    ...putCategoriaActivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputCategoriaDesactivo = {
    ...putCategoriaDesactivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  

    fastify.decorate('getCategorias', schemagetCategorias )
    fastify.decorate('getCategoria', schemagetCategoria )
    fastify.decorate('postCategoria', schemapostCategoria )
    fastify.decorate('putCategoria', schemaputCategoria )
    fastify.decorate('delCategoria', schemadelCategoria )
    fastify.decorate('putCategoriaActivo', schemaputCategoriaActivo )
    fastify.decorate('putCategoriaDesactivo', schemaputCategoriaDesactivo )
    

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

const Rescat = {
  id: { type: "number" },
  nombre: { type: "string" },
  descripcion: { type: "string" },
  estado: { type: "number" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
  userId: { type: "string" },
  parentId: { type: "number" },

}


const getCategorias = {
  schema: {
    tags: ["Categorias"],
    description: "ver todas las categorias",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una categoria por el nombre o por la descripcion, si se deja en blanco traera todas las categorias' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: Rescat
        },
      },
    },
  },
};

const getCategoria = {
  schema: {
    tags: ["Categorias"],
    description: "ver una sola categoria masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para buscar una unica categoria'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: Rescat
      },
    },
  },
};

const postCategoria = {
  schema: {
    tags: ["Categorias"],
    description: "introducir una sola categoria",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        nombre: { type: "string", maxLength: 50 },
        userId: { type: "string" },
        parentId: { type: "number" },
        descripcion: {
          type: "string",
          maxLength: 255,
          default: "el mejor papa",
        },
        estado: { type: "number", default: 1 },
      },
      required: ["nombre"],
    },
    response: {
      200: {
        type: "object",
        properties: Rescat
      },
    },
  },
};

const putCategoria = {
  schema: {
    tags: ["Categorias"],
    description: "actualizar una sola categoria",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      required: ["id"],
      properties: {
        id: { type: "number" },
        nombre: { type: "string", maxLength: 50 },
        descripcion: { type: "string", maxLength: 255 },
        estado: { type: "number", enum: [ 1, 0], description: 'el estado solo puede ser 1 o 0' },
        userId: { type: "string" },
        parentId: { type: "number" },

      },
    },
    response: {
      200: {
        type: "object",
        properties:Rescat
      },
    },
  },
};

const delCategoria = {
  schema: {
    tags: ["Categorias"],
    description: "borrar una sola categoria",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para Borrar una unica categoria'
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
const putCategoriaActivo = {
  schema: {
    tags: ["Categorias"],
    description: "actualizar el estado de una sola categoria",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una categoria' },
        estado: { type: "number", enum: [1], description: 'el estado solo para activar categoria' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: Rescat
      },
    },
  },
};

const putCategoriaDesactivo = {
  schema: {
    tags: ["Categorias"],
    description: "actualizar el estado de una sola categoria",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una categoria' },
        estado: { type: "number", enum: [0], description: 'el estado solo para desactivar' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: Rescat
      },
    },
  },
};