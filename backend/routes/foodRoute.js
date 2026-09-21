import express from 'express'
import { addFood, listFood, removeFood, updateFood } from '../controllers/foodController.js'
import multer from 'multer'
import authMiddleware from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const foodRouter = express.Router();

// Image Storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})
foodRouter.post('/add',authMiddleware,adminAuth,upload.single('image'),addFood)
foodRouter.get('/list',listFood)
foodRouter.put('/:id',authMiddleware,adminAuth,upload.single('image'),updateFood)
foodRouter.post('/remove',authMiddleware,adminAuth, removeFood)

export default foodRouter;
