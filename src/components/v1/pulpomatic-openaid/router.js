import { Router } from 'express';

import asyncHandler from '../../../utils/middlewares/asyncHandler';
import requestSchemaHandler from '../../../utils/middlewares/requestSchemaHandler';
import validateCountryCode from '../../../utils/middlewares/countryCodeValidation';
import loggedIn from '../../../utils/middlewares/autheticationHandler';
import getResourcesLastFiveYears from './controllers';

import getResourcesByCountryCodeAndLastFiveYearsSchema from './schemas';

const router = Router();

router.get('/', loggedIn, validateCountryCode, requestSchemaHandler(getResourcesByCountryCodeAndLastFiveYearsSchema, 'query'), asyncHandler(getResourcesLastFiveYears));

export default router;
