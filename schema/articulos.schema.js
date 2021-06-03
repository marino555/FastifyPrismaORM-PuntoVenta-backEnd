const fp = require("fastify-plugin");

async function decoraCat(fastify, options, next) {

  const schemagetArticulos = {
    ...getArticulos, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetArticulo = {
    ...getArticulo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemapostArticulo = {
    ...postArticulo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemaputArticulo = {
    ...putArticulo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemadelArticulo = {
    ...delArticulo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputArticuloActivo = {
    ...putArticuloActivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputArticuloDesactivo = {
    ...putArticuloDesactivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  

    fastify.decorate('getArticulos', schemagetArticulos )
    fastify.decorate('getArticulo', schemagetArticulo )
    fastify.decorate('postArticulo', schemapostArticulo )
    fastify.decorate('putArticulo', schemaputArticulo )
    fastify.decorate('delArticulo', schemadelArticulo )
    fastify.decorate('putArticuloActivo', schemaputArticuloActivo )
    fastify.decorate('putArticuloDesactivo', schemaputArticuloDesactivo )
    

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

const ResArticulo = {
  id: { type: "number" },
  nombre: { type: "string" },
  descripcion: { type: "string" },
  estado: { type: "number" },
  codigo: { type: "string" },
  precio_venta: { type: "number" },
  precio_compra: { type: "number" },
  stock: { type: "number" },
  createdAt: { type: "string" },
  updatedAt: { type: "string" },
  userId: { type: "number" },
  catId: { type: "number" },

}


const getArticulos = {
  schema: {
    tags: ["Articulos"],
    description: "ver todas las Articulos",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una Articulo por el nombre o por la descripcion, si se deja en blanco traera todas las Articulos' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: ResArticulo
        },
      },
    },
  },
};

const getArticulo = {
  schema: {
    tags: ["Articulos"],
    description: "ver una sola Articulo masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para buscar una unica Articulo'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: ResArticulo
      },
    },
  },
};

const postArticulo = {
  schema: {
    tags: ["Articulos"],
    description: "introducir una sola Articulo",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        nombre: { type: "string", maxLength: 50 },
        descripcion: {
          type: "string",
          maxLength: 255,
          default: "el mejor papa",
        },
        estado: { type: "number", default: 1, enum: [ 1, 0], description: 'el estado solo puede ser 1 o 0' },
        userId: { type: "number" },
        catId: { type: "number" },
        codigo: { type: "string" },
        precio_venta: { type: "number" },
        precio_compra: { type: "number" },
        stock: { type: "number" },
      },
      required: ["nombre"],
    },
    response: {
      200: {
        type: "object",
        properties: ResArticulo
      },
    },
  },
};

const putArticulo = {
  schema: {
    tags: ["Articulos"],
    description: "actualizar una sola Articulo",
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
        userId: { type: "number" },
        catId: { type: "number" },
        codigo: { type: "string" },
        precio_venta: { type: "number" },
        precio_compra: { type: "number" },
        stock: { type: "number" },

      },
    },
    response: {
      200: {
        type: "object",
        properties:ResArticulo
      },
    },
  },
};

const delArticulo = {
  schema: {
    tags: ["Articulos"],
    description: "borrar una sola Articulo",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para Borrar una unica Articulo'
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
const putArticuloActivo = {
  schema: {
    tags: ["Articulos"],
    description: "actualizar el estado de una sola Articulo",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Articulo' },
        estado: { type: "number", enum: [1], description: 'el estado solo para activar Articulo' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResArticulo
      },
    },
  },
};

const putArticuloDesactivo = {
  schema: {
    tags: ["Articulos"],
    description: "actualizar el estado de una sola Articulo",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Articulo' },
        estado: { type: "number", enum: [0], description: 'el estado solo para desactivar' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResArticulo
      },
    },
  },
};