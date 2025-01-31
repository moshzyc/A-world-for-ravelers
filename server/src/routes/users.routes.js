import express from "express"
import AppError from "../utils/appError.js"
import userCtrl from "../controllers/users.controller.js"
import { auth, autAdmin } from "../middlewares/auth.js"
import { userPostCtrl } from "../controllers/userPost.controller.js"
const router = express.Router()

router.post("/signup", userCtrl.signup)
router.post("/login", userCtrl.login)
router.get("/logout", userCtrl.logout)
router.get("/info", auth, userCtrl.getInfo)
router.delete("/delete", auth, userCtrl.deleteUser)
router.put("/update", auth, userCtrl.updateUser)
router.put("/cart", auth, userCtrl.saveCart)
router.get("/cart", auth, userCtrl.getCart)
router.post("/save-order", auth, userCtrl.saveOrder)
router.get("/get-orders", auth, userCtrl.getOrders)
router.get("/verify/:token", userCtrl.verifyEmail)
router.post("/toggle-favorite", auth, userCtrl.toggleFavorite)
router.get("/favorites", auth, userCtrl.getFavorites)
router.get("/all-orders", autAdmin, userCtrl.getAllOrders)
router.put("/update-order-status", autAdmin, userCtrl.updateOrderStatus)
router.get("/all-users", autAdmin, userCtrl.getAllUsers)
router.put("/admin-update-user", autAdmin, userCtrl.adminUpdateUser)
router.post("/rate/:id", auth, userPostCtrl.ratePost)
router.post("/save-trip", auth, userCtrl.saveTrip)
router.get("/trips", auth, userCtrl.getTrips)
router.delete("/trips/:tripId", auth, userCtrl.deleteTrip)
router.put("/trips/:tripId", auth, userCtrl.updateTrip)

export default router
