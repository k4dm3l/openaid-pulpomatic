import { Router } from 'express';

import asyncHandler from '../../../utils/middlewares/asyncHandler';
import requestSchemaHandler from '../../../utils/middlewares/requestSchemaHandler';
import getToken from './controllers';

import loginSchema from './schemas';

const router = Router();

router.post('/login', requestSchemaHandler(loginSchema), asyncHandler(getToken));

export default router;
