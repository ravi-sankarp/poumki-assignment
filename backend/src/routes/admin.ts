import { Router } from 'express';
import adminController from '../controllers/adminController';
import protect from '../middlewares/authMiddleware';

const router: Router = Router();

/* GET users listing. */
router.post('/login', adminController.adminLogin);

// //route to get all user data for the admin
// router.get('/getuserdata', protect('admin'), adminController.getUserData);

// //route to get user data of a single user
// router.get('/getuserdata/:id', protect('admin'), adminController.getSingleUserData);

// //route for adding new users
// router.post('/addnewuser', protect('admin'), adminController.addNewUser);

// //route for editing user data
// router.put('/edituserdata/:id', protect('admin'), adminController.editUser);

// //route for deleting user
// router.delete('/deleteuser/:id', protect('admin'), adminController.deleteUser);

export default router;
