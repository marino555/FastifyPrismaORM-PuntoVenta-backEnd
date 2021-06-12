const fp = require("fastify-plugin");

async function decoraIngeso(fastify, options, next) {

  const squemagetIngresos = {
    ...getIngresos,  
   // preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
  }
  const squemagetIngreso = {
    ...getIngreso, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
  }
  const squemapostIngreso = {
    ...postIngreso, 
   // preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }
  const squemaputIngreso = {
    ...putIngreso, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }
  const squemadelIngreso = {
    ...delIngreso, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemaputIngresoActivo = {
    ...putIngresoActivo, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemaputIngresoDesactivo = {
    ...putIngresoDesactivo, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemagetIngresoGrafico = {
    ...getIngresoGrafico, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemagetIngresoFecha = {
    ...getIngresoFecha, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  

    fastify.decorate('getIngresos', squemagetIngresos )
    fastify.decorate('getIngreso', squemagetIngreso )
    fastify.decorate('postIngreso', squemapostIngreso )

    fastify.decorate('getIngresoGrafico', squemagetIngresoGrafico )
    fastify.decorate('getIngresoFecha', squemagetIngresoFecha )
    // fastify.decorate('putIngreso', squemaputIngreso )
    // fastify.decorate('delIngreso', squemadelIngreso )
    fastify.decorate('putIngresoActivo', squemaputIngresoActivo )
    fastify.decorate('putIngresoDesactivo', squemaputIngresoDesactivo )
    

next()
}
module.exports = fp(decoraIngeso);


const detaCool = {
  type: "object",
  properties: {
    id: { type: "number" },
    articuloId: { type: "number" },
    cantidad: { type: "number" },
    precio: { type: "number" },
    estado: { type: "number" },
  }

}


const resCool = {
  type: "object",
  properties: {
    id: { type: "number" },
    tipo_comprobante: { type: "string" },
    serie_comprobante: { type: "string" },
    num_comprobante: { type: "string" },
    impuesto: { type: "number", maxLength: 20 },
    total: { type: "number", maxLength: 20 },
    estado: { type: "number" },
    createdAt: { type: "string" },
    updated_at: { type: "string" },

    userId: { type: "number" },
    personaId: { type: "number" },
    DetalleIngeso: {  
      type: "array",
      items: detaCool,
    },
  },
}


const seguridad = {
  security: [
    {
      bearerAuth: [],
    },
  ],
};


const getIngresos = {
  schema: {
    tags: ["Ingresos"],
    description: "ver todas las Ingresos",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el num_comprobante o el serie_comprobante para buscar una Ingreso por el nombre o por la descripcion, si se deja en blanco traera todas las Ingresos' },
    },
    response: {
      200: {
        type: "array",
        items: resCool
      },
    },
  },
}

const getIngreso = {
  schema: {
    tags: ["Ingresos"],
    description: "ver un solo Ingreso masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'string',
          description: 'el ID es necesario para buscar un unico Ingreso'
        }
      }
    },
    response: {
     // 200: resCool
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
        tipo_comprobante: { type: "string" },
        serie_comprobante: { type: "string" },
        num_comprobante: { type: "string" },
        impuesto: { type: "number", maxLength: 64 },
        total: { type: "number", maxLength: 20 },
        estado: { type: "number", default: 1 },

        userId: {type: "number" },
        personaId: { type: "number" },
        DetalleIngeso: {  
          type: "array",
          items: detaCool,
        },
      },
      required: ["userId"],
    },
    response: {
      200: resCool
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
      required: ["_id"],
      properties: {
        id: { type: "number" },
        tipo_comprobante: { type: "string" },
        serie_comprobante: { type: "string" },
        num_comprobante: { type: "string" },
        impuesto: { type: "number", maxLength: 64 },
        total: { type: "number", maxLength: 20 },
        estado: { type: "number", default: 1 },

        userId: {type: "number" },
        personaId: { type: "number" },
        DetalleIngeso: {  
          type: "array",
          items: detaCool,
        },
      },
    },
    response: {
      200: resCool
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
          type: 'string',
          description: 'el ID es necesario para Borrar una unica Ingreso'
        }
      }
    },
    response: {
      200: {
        type: "object",
        properties: {
          estatus: { type: "boolean" },
        },
      },
    },
  },
};


const putIngresoActivo = {
  schema: {
    tags: ["Ingresos"],
    description: "actualizar el estado de un solo Ingreso",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado del Ingreso' }
      },
    },
    response: {
      // 200: resCool
    },
  },
};

const putIngresoDesactivo = {
  schema: {
    tags: ["Ingresos"],
    description: "actualizar el estado de un solo Ingreso",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado del Ingreso' }
      },
    },
    response: {
      // 200: resCool
    },
  },
};

const getIngresoGrafico = {
  schema: {
    tags: ["Ingresos"],
    description: "ver todos los ingreso, datos para graficos",
   // ...seguridad,
    additionalProperties: false,
    // querystring: {
    //   // required: ['consulta'],
    //   consulta: { type: "string" , description: 'introdusca el num_comprobante o el serie_comprobante para buscar una Venta por el nombre o por la descripcion, si se deja en blanco traera todas las Ventas' },
    // },
    // response: {
    //   200: {
    //     type: "array",
    //     items: resCool
    //   },
    // },
  },
}

const getIngresoFecha = { 
  schema: {
    tags: ["Ingresos"],
    description: "ver todos los ingreso por fecha",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['empiesa'],
      empiesa: { type: "string" , default: "2000-01-01", description: 'introdusca la fecha de inicio en formato 2021-05-10 (año-mes-dia)' },
      termina: { type: "string" ,  default: "2200-01-01", description: 'introdusca la fecha de final en formato 2021-05-10 (año-mes-dia)' },
    },
    response: {
      200: {
        type: "array",
        items: resCool
      },
    },
  },
}