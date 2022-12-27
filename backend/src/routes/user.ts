import express from 'express';
import userController from '../controllers/userController';
import protect from '../middlewares/authMiddleware';
import validate from '../middlewares/validate';
import { JoiLoginSchema, JoiRegisterSchema } from '../validations/joiSchema';

const router = express.Router();

//Route for user login
router.post('/login', validate(JoiLoginSchema), userController.userLogin);

//Route for user registration
router.post('/register', validate(JoiRegisterSchema), userController.registerUser);

//Route for getting user data
router.get('/getuser', protect('user'), userController.getUserData);

export default router;
