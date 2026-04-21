const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scalable REST API',
      version: '1.0.0',
      description: 'REST API with JWT authentication, RBAC, and Products CRUD'
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed' },
            details: {
              nullable: true,
              oneOf: [
                { type: 'array', items: { type: 'object' } },
                { type: 'object' },
                { type: 'null' }
              ]
            }
          }
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '663a53be5f7c96cb6f2f1111' },
            name: { type: 'string', example: 'Alex Doe' },
            email: { type: 'string', example: 'alex@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: { $ref: '#/components/schemas/UserPublic' }
              }
            }
          }
        },
        ProductResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Product created' },
            data: { $ref: '#/components/schemas/Product' }
          }
        },
        ProductListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            count: { type: 'number', example: 2 },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Server is healthy' }
          }
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Alex Doe' },
            email: { type: 'string', format: 'email', example: 'alex@example.com' },
            password: { type: 'string', minLength: 8, example: 'StrongPass123!' }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'alex@example.com' },
            password: { type: 'string', example: 'StrongPass123!' }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price'],
          properties: {
            name: { type: 'string', example: 'Wireless Mouse' },
            description: { type: 'string', example: 'Ergonomic bluetooth mouse' },
            price: { type: 'number', example: 49.99 },
            inStock: { type: 'boolean', example: true },
            category: { type: 'string', example: 'Electronics' }
          }
        },
        Product: {
          allOf: [
            { $ref: '#/components/schemas/ProductInput' },
            {
              type: 'object',
              properties: {
                _id: { type: 'string', example: '663a53be5f7c96cb6f2f1234' },
                owner: { type: 'string', example: '663a53be5f7c96cb6f2f1111' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            }
          ]
        }
      }
    }
  },
  apis: ['./src/routes/v1/*.js', './src/app.js']
};

module.exports = swaggerJsdoc(options);
