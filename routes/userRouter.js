const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/regin', userController.regin)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/all', userController.getUsers)
router.post('/get', userController.getOneUser)
router.put('/change/status', userController.changeStatus)
router.get('/status', userController.getCountUsersStatus)
router.put('/change/dateLogin', userController.changeDateLogin)

module.exports = router