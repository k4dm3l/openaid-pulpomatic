import joi from 'joi';

const createUserSchema = joi.object({
  username: joi.string().trim().lowercase().required()
    .messages({
      'any.required': 'username is required (Lower case)',
    }),
  password: joi.string().trim().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/).required()
    .messages({
      'any.required': 'password does not fullfill the requirements. At least one letter lowercase, one uppercase, one digit and one special character',
    }),
});

export default createUserSchema;
