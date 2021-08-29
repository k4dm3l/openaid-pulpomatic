import boom from '@hapi/boom';

const schemaValidator = (requestData, schema) => {
  const { error } = schema.validate(requestData);
  return error;
};

const validateRequestSchema = (schema, requestProperty = 'body') => function (req, res, next) {
  const error = schemaValidator(req[requestProperty], schema);
  if (error) {
    res.status(boom.badRequest().output.statusCode).json({ message: error.message });
  } else {
    next();
  }
};

export default validateRequestSchema;
