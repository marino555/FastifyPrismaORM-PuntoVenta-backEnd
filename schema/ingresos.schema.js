const fp = require("fastify-plugin");

async function IngresosCool(fastify, options, next) {

  const schemagetIngresos = {
    ...getIngresos, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemagetIngreso = {
    ...getIngreso, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "or"}) 
  }
  const schemapostIngreso = {
    ...postIngreso, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemaputIngreso = {
    ...putIngreso, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }
  const schemadelIngreso = {
    ...delIngreso, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputIngresoActivo = {
    ...putIngresoActivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  
const schemaputIngresoDesactivo = {
    ...putIngresoDesactivo, 
   // preHandler: fastify.auth([fastify.registrado, fastify.verifyAdmin],{relation: "and"}) 
    }  

    fastify.decorate('getIngresos', schemagetIngresos )
    fastify.decorate('getIngreso', schemagetIngreso )
    fastify.decorate('postIngreso', schemapostIngreso )
    fastify.decorate('putIngreso', schemaputIngreso )
    fastify.decorate('delIngreso', schemadelIngreso )
    fastify.decorate('putIngresoActivo', schemaputIngresoActivo )
    fastify.decorate('putIngresoDesactivo', schemaputIngresoDesactivo )
    

next()
}
module.exports = fp(IngresosCool);


const seguridad = {
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const ResIngreso = {
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


const getIngresos = {
  schema: {
    tags: ["Ingresos"],
    description: "ver todas las Ingresos",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el texto para buscar una Ingreso por el nombre o por la descripcion, si se deja en blanco traera todas las Ingresos' },
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: ResIngreso
        },
      },
    },
  },
};

const getIngreso = {
  schema: {
    tags: ["Ingresos"],
    description: "ver una sola Ingreso masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para buscar una unica Ingreso'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: ResIngreso
      },
    },
  },
};

const postIngreso = {
  schema: {
    tags: ["Ingresos"],
    description: "introducir una sola Ingreso",
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
        properties: ResIngreso
      },
    },
  },
};

const putIngreso = {
  schema: {
    tags: ["Ingresos"],
    description: "actualizar una sola Ingreso",
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
        properties:ResIngreso
      },
    },
  },
};

const delIngreso = {
  schema: {
    tags: ["Ingresos"],
    description: "borrar una sola Ingreso",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para Borrar una unica Ingreso'
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
const putIngresoActivo = {
  schema: {
    tags: ["Ingresos"],
    description: "actualizar el estado de una sola Ingreso",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Ingreso' },
        estado: { type: "number", enum: [1], description: 'el estado solo para activar Ingreso' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResIngreso
      },
    },
  },
};

const putIngresoDesactivo = {
  schema: {
    tags: ["Ingresos"],
    description: "actualizar el estado de una sola Ingreso",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado de una Ingreso' },
        estado: { type: "number", enum: [0], description: 'el estado solo para desactivar' },
      },
    },
    response: {
      200: {
        type: "object",
        properties: ResIngreso
      },
    },
  },
};