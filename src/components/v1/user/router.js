import { Router } from 'express';

import { getAuditInformation } from 'trackology';
import asyncHandler from '../../../utils/middlewares/asyncHandler';
import requestSchemaHandler from '../../../utils/middlewares/requestSchemaHandler';
import loggedIn from '../../../utils/middlewares/autheticationHandler';
import createUser from './controllers';

import createUserSchema from './schemas';

const router = Router();

router.get('/', getAuditInformation, (req, res) => {
  res.status(200).json({
    audit: req.audit || {},
  });
});
router.post('/', loggedIn, requestSchemaHandler(createUserSchema), asyncHandler(createUser));

export default router;
