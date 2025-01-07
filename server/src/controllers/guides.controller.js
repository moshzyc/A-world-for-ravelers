import mongoose from "mongoose"
import AppError from "../utils/appError.js"
import { Guide } from "../models/Guide.model.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const guidesCtrl = {
  async addGuide(req, res, next) {
    try {
      const { title } = req.body
      let content = req.body.content || ""
      let imageUrls = req.body.imageUrls || []

      // Parse imageUrls if it's a string
      try {
        imageUrls =
          typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls
      } catch (e) {
        console.error("Error parsing imageUrls:", e)
        imageUrls = []
      }

      const guideData = {
        title,
        content,
        images: [],
        mainImage: "",
      }

      // Handle main image from file upload
      if (req.files && req.files.mainImage && req.files.mainImage[0]) {
        const mainImageFile = req.files.mainImage[0]
        const mainImageResult = await cloudinary.uploader.upload(
          mainImageFile.path,
          {
            folder: "guides/main",
          }
        )
        guideData.mainImage = mainImageResult.secure_url
        fs.unlinkSync(mainImageFile.path)
      } else if (req.body.mainImageUrl) {
        guideData.mainImage = req.body.mainImageUrl
      }

      // Handle additional images from file upload
      if (req.files && req.files.images) {
        for (const file of req.files.images) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "guides/content",
          })
          guideData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      // Handle image URLs
      if (imageUrls && imageUrls.length > 0) {
        guideData.images.push(...imageUrls)
      }

      const newGuide = new Guide(guideData)
      const savedGuide = await newGuide.save()

      res.status(201).json({
        message: "Guide created successfully",
        guide: savedGuide,
      })
    } catch (error) {
      console.error("Error in addGuide:", error)
      next(new AppError("Failed to create guide", 500, error))
    }
  },

  async updateGuide(req, res, next) {
    try {
      const { id } = req.params
      const { title } = req.body
      let content = req.body.content || ""
      let imageUrls = req.body.imageUrls || []

      // Parse imageUrls if it's a string
      try {
        imageUrls =
          typeof imageUrls === "string" ? JSON.parse(imageUrls) : imageUrls
      } catch (e) {
        console.error("Error parsing imageUrls:", e)
        imageUrls = []
      }

      const updateData = {
        title,
        content,
        images: [...imageUrls],
      }

      // Handle main image from file upload
      if (req.files && req.files.mainImage && req.files.mainImage[0]) {
        const mainImageFile = req.files.mainImage[0]
        const mainImageResult = await cloudinary.uploader.upload(
          mainImageFile.path,
          {
            folder: "guides/main",
          }
        )
        updateData.mainImage = mainImageResult.secure_url
        fs.unlinkSync(mainImageFile.path)
      } else if (req.body.mainImageUrl) {
        updateData.mainImage = req.body.mainImageUrl
      }

      // Handle additional images from file upload
      if (req.files && req.files.images) {
        for (const file of req.files.images) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            folder: "guides/content",
          })
          updateData.images.push(uploadResult.secure_url)
          fs.unlinkSync(file.path)
        }
      }

      const updatedGuide = await Guide.findByIdAndUpdate(id, updateData, {
        new: true,
      })

      if (!updatedGuide) {
        return next(new AppError("Guide not found", 404))
      }

      res.json({
        message: "Guide updated successfully",
        guide: updatedGuide,
      })
    } catch (error) {
      console.error("Error in updateGuide:", error)
      next(new AppError("Failed to update guide", 500, error))
    }
  },

  async getGuides(req, res, next) {
    try {
      const guides = await Guide.find()
      res.status(200).json(guides)
    } catch (error) {
      next(new AppError("Failed to fetch guides", 500, error))
    }
  },

  async deleteGuide(req, res, next) {
    try {
      const guideId = req.params.id
      const deletedGuide = await Guide.findByIdAndDelete(guideId)

      if (!deletedGuide) {
        return next(new AppError("Guide not found", 404))
      }

      res.status(200).json({
        message: "Guide deleted successfully",
        guide: deletedGuide,
      })
    } catch (error) {
      next(new AppError("Failed to delete guide", 500, error))
    }
  },

  async getGuideById(req, res, next) {
    try {
      const guide = await Guide.findById(req.params.id)
      if (!guide) {
        return next(new AppError("Guide not found", 404))
      }
      res.status(200).json(guide)
    } catch (error) {
      next(new AppError("Failed to fetch guide", 500, error))
    }
  },
}

export { guidesCtrl }
