import Joi from 'joi';

export const JoiLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `Please provide a valid email`,
    'any.required': `Please provdie your email`
  }),
  password: Joi.string().min(4).max(15).required().messages({
    'string.min': `Password must be atleast 4 characters`,
    'string.max': `Password must be less than 15 characters`,
    'any.required': `Please provide your password`
  })
});

export const JoiRegisterSchema = Joi.object({
  firstName: Joi.string()
    .min(4)
    .regex(/^[aA-zZ\s]+$/)
    .required()
    .messages({
      'string.min': `First Name must be atleast 4 characters`,
      'any.required': `Please provide your first name`,
      'string.pattern.base': `Please provide a valid first name`
    }),
  lastName: Joi.string()
    .min(1)
    .regex(/^[aA-zZ\s]+$/)
    .required()
    .messages({
      'string.min': `Last Name must be atleast 1 character long`,
      'any.required': `Please provide your last name`,
      'string.pattern.base': `Please provide a valid last name`
    }),
  email: Joi.string().email().required().messages({
    'string.email': `Please provide a valid email`,
    'any.required': `Please provide your email`
  }),
  password: Joi.string().min(4).max(15).required().messages({
    'string.min': `Password must be atleast 4 characters`,
    'string.max': `Password must be less than 15 characters`,
    'any.required': `Please provide your password`
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.required': `Please confirm your password`,
    'any.only': `Passwords does not match`
  })
});
