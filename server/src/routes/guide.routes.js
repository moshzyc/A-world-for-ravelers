import express from "express"
import multer from "multer"
import { guidesCtrl } from "../controllers/guides.controller.js"
import { autAdmin, auth } from "../middlewares/auth.js"

const router = express.Router()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const upload = multer({ storage })

router.get("/", guidesCtrl.getGuides)
router.post("/add", upload.array("images"), guidesCtrl.addGuide)
router.put("/update/:id",  guidesCtrl.updateGuide)
router.delete("/delete/:id", guidesCtrl.deleteGuide)

export default router