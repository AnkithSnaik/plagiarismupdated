import express from 'express';
import {signup,login} from  "../controller/student.controller.js"
const router = express.Router()
router.post("/signup",signup)
router.post("/login",login)

export default router;