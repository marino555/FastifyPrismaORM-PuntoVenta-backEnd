const fp = require("fastify-plugin");

async function decoraVenta(fastify, options, next) {

  const squemagetVentas = {
    ...getVentas,  
   // preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
  }
  const squemagetVenta = {
    ...getVenta, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
  }
  const squemapostVenta = {
    ...postVenta, 
   // preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }
  const squemaputVenta = {
    ...putVenta, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }
  const squemadelVenta = {
    ...delVenta, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemaputVentaActivo = {
    ...putVentaActivo, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemaputVentaDesactivo = {
    ...putVentaDesactivo, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemagetVentaGrafico = {
    ...getVentaGrafico, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  
const squemagetVentaFecha = {
    ...getVentaFecha, 
  //  preHandler: fastify.auth([verifyToken, verifyAdmin],{relation: "and"})  
    }  

    fastify.decorate('getVentas', squemagetVentas )
    fastify.decorate('getVenta', squemagetVenta )
    fastify.decorate('postVenta', squemapostVenta )

    fastify.decorate('getVentaGrafico', squemagetVentaGrafico )
    fastify.decorate('getVentaFecha', squemagetVentaFecha )
    // fastify.decorate('putVenta', squemaputVenta )
    fastify.decorate('delVenta', squemadelVenta )
    fastify.decorate('putVentaActivo', squemaputVentaActivo )
    fastify.decorate('putVentaDesactivo', squemaputVentaDesactivo )
    

next()
}
module.exports = fp(decoraVenta);


const detaCool = {
  type: "object",
  properties: {
    id: { type: "number" },
    articuloId: { type: "number" },
    cantidad: { type: "number" },
    precio: { type: "number" },
    descuento: { type: "number" },
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
    descuento: { type: "number", maxLength: 20 },
    mes: { type: "number", maxLength: 10 },
    ano: { type: "number", maxLength: 10 },
    estado: { type: "number" },
    createdAt: { type: "string" },
    updatedAt: { type: "string" },

    userId: { type: "number" },
    personaId: { type: "number" },
    DetalleVenta: {  
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


const getVentas = {
  schema: {
    tags: ["Ventas"],
    description: "ver todas las Ventas",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['consulta'],
      consulta: { type: "string" , description: 'introdusca el num_comprobante o el serie_comprobante para buscar una Venta por el nombre o por la descripcion, si se deja en blanco traera todas las Ventas' },
    },
    response: {
      200: {
        type: "array",
        items: resCool
      },
    },
  },
}

const getVenta = {
  schema: {
    tags: ["Ventas"],
    description: "ver un solo Venta masss",
    ...seguridad,
    // additionalProperties: false,
    // type: "string",
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'string',
          description: 'el ID es necesario para buscar un unico Venta'
        }
      }
    },
    response: {
     // 200: resCool
    },
  },
};

const postVenta = {
  schema: {
    tags: ["Ventas"],
    description: "introducir una sola Venta",
    ...seguridad,
    body: {
      type: "object",
      additionalProperties: false,
      properties: {
        tipo_comprobante: { type: "string" },
        serie_comprobante: { type: "string" },
        num_comprobante: { type: "string" },
        impuesto: { type: "number", maxLength: 64 },
        descuento: { type: "number", maxLength: 64 },
        total: { type: "number", maxLength: 20 },
        estado: { type: "number", default: 1 },

        userId: {type: "number" },
        personaId: { type: "number" },
        DetalleVenta: {  
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

const putVenta = {
  schema: {
    tags: ["Ventas"],
    description: "actualizar una sola Venta",
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
        DetalleVenta: {  
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

const delVenta = {
  schema: {
    tags: ["Ventas"],
    description: "borrar una sola Venta",
    ...seguridad,
    params: {
      type: 'object',
      required: ["id"],
      properties: {
        id: {
          type: 'number',
          description: 'el ID es necesario para Borrar una unica Venta'
        }
      }
    },
    response: {
      /* 200: {
        type: "object",
        properties: {
          estatus: { type: "boolean" },
        },
      }, */
    },
  },
};


const putVentaActivo = {
  schema: {
    tags: ["Ventas"],
    description: "actualizar el estado de un solo Venta",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado del Venta' }
      },
    },
    response: {
      // 200: resCool
    },
  },
};

const putVentaDesactivo = {
  schema: {
    tags: ["Ventas"],
    description: "actualizar el estado de un solo Venta",
    ...seguridad,
    body: {
      required: ["id"],
      additionalProperties: false,
      type: "object",
      properties: {
        id: { type: "number", description: 'el ID es necesario para actualizar el estado del Venta' }
      },
    },
    response: {
      // 200: resCool
    },
  },
};

const getVentaGrafico = {
  schema: {
    tags: ["Ventas"],
    description: "ver todos los Venta, datos para graficos",
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

const getVentaFecha = { 
  schema: {
    tags: ["Ventas"],
    description: "ver todos los Venta por fecha",
   // ...seguridad,
    additionalProperties: false,
    querystring: {
      // required: ['empiesa'],
      empiesa: { type: "string" , default: "2000-01-01", description: 'introdusca la fecha de inicio en formato 2021-05-10 (año-mes-dia)' },
      termina: { type: "string" ,  default: "2200-01-01", description: 'introdusca la fecha de final en formato 2021-05-10 (año-mes-dia)' },
    },
    response: {
     /*  200: {
        type: "array",
        items: resCool
      }, */
    },
  },
}