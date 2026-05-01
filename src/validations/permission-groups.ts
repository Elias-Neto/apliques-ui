import { celebrate, Joi, Segments } from 'celebrate';
import { Module } from '@/types/enums';

// Helper para validação de ObjectId do MongoDB
const objectId = (joi: typeof Joi) => joi.string().hex().length(24);

// Parâmetros base para rotas de grupos de permissão
const baseParams = {
  permissionGroupID: objectId(Joi).required(),
};

// Schema para validação de atualização de grupo de permissão
export const validateUpdatePermissionGroupSchema = celebrate({
  [Segments.PARAMS]: baseParams,
  [Segments.BODY]: {
    module: Joi.string()
      .valid(...Object.values(Module))
      .required()
      .messages({
        'any.only': 'Módulo deve ser um dos valores configurados em Module enum',
        'any.required': 'Módulo é obrigatório'
      }),
    contexts: Joi.array()
      .items(
        Joi.object({
          context: Joi.string()
            .required()
            .messages({
              'any.required': 'Contexto é obrigatório',
              'string.empty': 'Contexto não pode estar vazio'
            }),
          permissions: Joi.array()
            .items(
              Joi.object({
                permission: Joi.string()
                  .required()
                  .messages({
                    'any.required': 'Permissão é obrigatória',
                    'string.empty': 'Permissão não pode estar vazia'
                  }),
                active: Joi.boolean()
                  .required()
                  .messages({
                    'any.required': 'Status ativo é obrigatório',
                    'boolean.base': 'Status ativo deve ser verdadeiro ou falso'
                  }),
              })
            )
            .required()
            .min(1)
            .messages({
              'any.required': 'Lista de permissões é obrigatória',
              'array.min': 'Deve haver pelo menos uma permissão'
            }),
        })
      )
      .required()
      .min(1)
      .messages({
        'any.required': 'Lista de contextos é obrigatória',
        'array.min': 'Deve haver pelo menos um contexto'
      }),
  },
});

// Schema para validação de criação de grupo de permissão
export const validateCreatePermissionGroupSchema = celebrate({
  [Segments.BODY]: {
    label: Joi.string()
      .required()
      .min(2)
      .max(100)
      .messages({
        'any.required': 'Nome do grupo é obrigatório',
        'string.min': 'Nome do grupo deve ter pelo menos 2 caracteres',
        'string.max': 'Nome do grupo deve ter no máximo 100 caracteres',
        'string.empty': 'Nome do grupo não pode estar vazio'
      }),
    module: Joi.string()
      .valid(...Object.values(Module))
      .required()
      .messages({
        'any.only': 'Módulo deve ser um dos valores configurados em Module enum',
        'any.required': 'Módulo é obrigatório'
      }),
    contexts: Joi.array()
      .items(
        Joi.object({
          context: Joi.string()
            .required()
            .messages({
              'any.required': 'Contexto é obrigatório',
              'string.empty': 'Contexto não pode estar vazio'
            }),
          permissions: Joi.array()
            .items(
              Joi.object({
                permission: Joi.string()
                  .required()
                  .messages({
                    'any.required': 'Permissão é obrigatória',
                    'string.empty': 'Permissão não pode estar vazia'
                  }),
                active: Joi.boolean()
                  .required()
                  .messages({
                    'any.required': 'Status ativo é obrigatório',
                    'boolean.base': 'Status ativo deve ser verdadeiro ou falso'
                  }),
              })
            )
            .required()
            .min(1)
            .messages({
              'any.required': 'Lista de permissões é obrigatória',
              'array.min': 'Deve haver pelo menos uma permissão'
            }),
        })
      )
      .required()
      .min(1)
      .messages({
        'any.required': 'Lista de contextos é obrigatória',
        'array.min': 'Deve haver pelo menos um contexto'
      }),
  },
});

// Schema para validação de listagem de grupos de permissão
export const validateListPermissionGroupsSchema = celebrate({
  [Segments.QUERY]: {
    module: Joi.string()
      .valid(...Object.values(Module))
      .optional()
      .messages({
        'any.only': 'Módulo deve ser um dos valores configurados em Module enum'
      }),
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .default(1)
      .messages({
        'number.base': 'Página deve ser um número',
        'number.integer': 'Página deve ser um número inteiro',
        'number.min': 'Página deve ser maior que 0'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional()
      .default(10)
      .messages({
        'number.base': 'Limite deve ser um número',
        'number.integer': 'Limite deve ser um número inteiro',
        'number.min': 'Limite deve ser maior que 0',
        'number.max': 'Limite deve ser no máximo 100'
      }),
  },
});

// Schema para validação de busca de grupo de permissão por ID
export const validateGetPermissionGroupSchema = celebrate({
  [Segments.PARAMS]: {
    permissionGroupID: objectId(Joi).required()
      .messages({
        'string.length': 'ID do grupo de permissão deve ter 24 caracteres hexadecimais',
        'string.hex': 'ID do grupo de permissão deve conter apenas caracteres hexadecimais',
        'any.required': 'ID do grupo de permissão é obrigatório'
      }),
  },
});

// Schema para validação de exclusão de grupo de permissão
export const validateDeletePermissionGroupSchema = celebrate({
  [Segments.PARAMS]: {
    permissionGroupID: objectId(Joi).required()
      .messages({
        'string.length': 'ID do grupo de permissão deve ter 24 caracteres hexadecimais',
        'string.hex': 'ID do grupo de permissão deve conter apenas caracteres hexadecimais',
        'any.required': 'ID do grupo de permissão é obrigatório'
      }),
  },
});



