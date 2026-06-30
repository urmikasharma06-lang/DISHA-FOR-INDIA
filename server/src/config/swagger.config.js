const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Disha for India — API',
      version: '1.0.0',
      description: `
## Disha for India — Backend REST API

This is the official API documentation for the **Disha for India** volunteer management platform.

### Authentication
Most endpoints require a **JWT Bearer Token**.

1. Use **POST /api/v1/auth/register** to create an account.
2. Use **POST /api/v1/auth/login** to obtain an \`accessToken\`.
3. Click the **Authorize 🔓** button above and paste: \`Bearer <your_accessToken>\`.
4. All protected endpoints will now include the token automatically.

### Rate Limits
| Endpoint Group      | Limit             |
|---------------------|-------------------|
| Login / Register    | 5 requests / 15 min |
| Forgot Password     | 3 requests / 1 hour |
| Global API          | 100 requests / 15 min (production only) |
      `,
      contact: {
        name: 'Disha for India Engineering Team',
        email: 'tech@dishaforindia.org',
        url: 'https://dishaforindia.org',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Local Development Server',
      },
      {
        url: 'https://api.dishaforindia.org',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token. Example: **Bearer eyJhbGci...**',
        },
      },
      schemas: {
        // ─── User ───────────────────────────────────────────────
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '665f1b2c3d4e5f6789abcdef',
            },
            volunteerId: {
              type: 'string',
              example: 'DISHA000001',
            },
            name: {
              type: 'string',
              example: 'Arjun Mehta',
            },
            username: {
              type: 'string',
              example: 'arjun_mehta',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
            phone: {
              type: 'string',
              example: '+919876543210',
            },
            role: {
              type: 'string',
              enum: ['guest', 'volunteer', 'coordinator', 'admin', 'superadmin'],
              example: 'volunteer',
            },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'inactive', 'suspended'],
              example: 'active',
            },
            profilePhoto: {
              type: 'string',
              example: 'https://res.cloudinary.com/disha/image/upload/v1/photo.jpg',
            },
            about: {
              type: 'string',
              example: 'Passionate about social impact and education.',
            },
            college: {
              type: 'string',
              example: 'IIT Delhi',
            },
            course: {
              type: 'string',
              example: 'B.Tech Computer Science',
            },
            city: {
              type: 'string',
              example: 'New Delhi',
            },
            state: {
              type: 'string',
              example: 'Delhi',
            },
            skills: {
              type: 'array',
              items: { type: 'string' },
              example: ['Teaching', 'React', 'Node.js'],
            },
            points: {
              type: 'integer',
              example: 120,
            },
            hoursCompleted: {
              type: 'number',
              example: 34.5,
            },
            programsCompleted: {
              type: 'integer',
              example: 3,
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-30T04:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-06-30T04:00:00.000Z',
            },
          },
        },

        // ─── Request Bodies ──────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'username', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Arjun Mehta',
            },
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 30,
              example: 'arjun_mehta',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'SecurePass123!',
            },
            phone: {
              type: 'string',
              example: '+919876543210',
            },
          },
        },

        LoginRequest: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
              description: 'Provide either email or username',
            },
            username: {
              type: 'string',
              example: 'arjun_mehta',
              description: 'Provide either email or username',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'SecurePass123!',
            },
          },
        },

        ForgotPasswordRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'arjun.mehta@disha.org',
            },
          },
        },

        ResetPasswordRequest: {
          type: 'object',
          required: ['password', 'confirmPassword'],
          properties: {
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              example: 'NewSecurePass456!',
            },
            confirmPassword: {
              type: 'string',
              format: 'password',
              example: 'NewSecurePass456!',
            },
          },
        },

        // ─── Responses ───────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed successfully.' },
            data: { type: 'object' },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred.' },
          },
        },

        ValidationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation Failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Valid email is required' },
                },
              },
            },
          },
        },

        AuthenticationError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Access token is missing. Please log in.' },
          },
        },

        RateLimitError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: {
              type: 'string',
              example: 'Too many requests from this IP. Please try again after 15 minutes.',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Authentication & Session Management',
      },
      {
        name: 'Users',
        description: 'User Management & Profiles',
      },
      {
        name: 'Health',
        description: 'Server health monitoring',
      },
    ],
  },
  // Paths to files containing JSDoc swagger annotations
  apis: [
    './src/modules/auth/auth.routes.js',
    './src/docs/auth.docs.js',
    './src/docs/health.docs.js',
    './src/docs/user.docs.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
