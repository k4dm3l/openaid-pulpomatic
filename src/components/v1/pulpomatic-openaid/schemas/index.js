import joi from 'joi';

const getResourcesByCountryCodeAndLastFiveYearsSchema = joi.object({
  country: joi.string().required().messages({
    'any.required': 'Valid country code is required',
  }),
  year: joi.number().integer().positive().min(1950)
    .max(2080)
    .required()
    .messages({
      'any.required': 'Year format YYYY is required',
    }),
});

export default getResourcesByCountryCodeAndLastFiveYearsSchema;
