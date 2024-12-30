import React, { useState } from "react"
import axios from "axios"
import { ADD_GUIDE_URL } from "../constants/endPoint"

export const AddGuide = () => {
  const [formValue, setFormValue] = useState({
    title: "",
    content: [""],
    images: [],
    imageUrls: [],
  })
  const [files, setFiles] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [mainImageUrl, setMainImageUrl] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMainImage(file)
    }
  }

  const handleMainImageUrlChange = (e) => {
    setMainImageUrl(e.target.value)
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
  }

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setFormValue((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl.trim()],
      }))
      setNewImageUrl("")
    }
  }

  const handleRemoveImageUrl = (index) => {
    setFormValue((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }))
  }

  const handleContentChange = (index, value) => {
    const updatedContent = [...formValue.content]
    updatedContent[index] = value
    setFormValue({ ...formValue, content: updatedContent })
  }

  const handleAddParagraph = () => {
    setFormValue({ ...formValue, content: [...formValue.content, ""] })
  }

  const handleRemoveParagraph = (index) => {
    const updatedContent = formValue.content.filter((_, i) => i !== index)
    setFormValue({ ...formValue, content: updatedContent })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", formValue.title)
      formData.append("content", JSON.stringify(formValue.content))

      // Append main image (file or URL)
      if (mainImage) {
        formData.append("mainImage", mainImage)
      } else if (mainImageUrl) {
        formData.append("mainImageUrl", mainImageUrl)
      }

      // Append additional files
      files.forEach((file) => {
        formData.append("images", file)
      })

      // Append imageUrls
      formData.append("imageUrls", JSON.stringify(formValue.imageUrls))

      const response = await axios.post(ADD_GUIDE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Guide added successfully:", response.data)

      // Reset form
      setFormValue({ title: "", content: [""], images: [], imageUrls: [] })
      setFiles([])
      setNewImageUrl("")
      setMainImage(null)
      setMainImageUrl("")
    } catch (error) {
      console.error("Error adding guide:", error.response?.data || error)
    }
  }

  return (
    <div className="p-4">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700">Title</label>
            <input
              className="rounded-lg border border-gray-300 p-2"
              type="text"
              placeholder="Enter guide title"
              value={formValue.title}
              onChange={(e) =>
                setFormValue({ ...formValue, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Main Image</label>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Upload Main Image</label>
              <input
                className="rounded-lg border border-gray-300 p-2"
                type="file"
                onChange={handleMainImageChange}
                accept="image/*"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <span className="text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Main Image URL</label>
              <input
                className="rounded-lg border border-gray-300 p-2"
                type="url"
                placeholder="Enter main image URL"
                value={mainImageUrl}
                onChange={handleMainImageUrlChange}
              />
            </div>

            {(mainImage || mainImageUrl) && (
              <div className="mt-2">
                <h3 className="mb-2 font-medium text-gray-700">
                  Main Image Preview:
                </h3>
                <div className="relative inline-block">
                  <img
                    src={
                      mainImage ? URL.createObjectURL(mainImage) : mainImageUrl
                    }
                    alt="Main image preview"
                    className="h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(null)
                      setMainImageUrl("")
                    }}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">Content</label>
            {formValue.content.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  className="min-h-[100px] flex-1 rounded-lg border border-gray-300 p-2"
                  placeholder={`Paragraph ${index + 1}`}
                  value={paragraph}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
                {formValue.content.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(index)}
                    className="redBtn self-start"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddParagraph}
              className="whiteBtn self-start"
            >
              Add Paragraph
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-medium text-gray-700">
              Additional Images
            </label>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Upload Images</label>
              <input
                className="rounded-lg border border-gray-300 p-2"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-600">Add Image URL</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 p-2"
                  type="url"
                  placeholder="Enter image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="whiteBtn"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-700">
                Additional Images:
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {files.map((file, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() =>
                          setFiles(files.filter((_, i) => i !== index))
                        }
                        className="redBtn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formValue.imageUrls.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium text-gray-700">
                Additional URL Images:
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {formValue.imageUrls.map((url, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={url}
                      alt={`URL Preview ${index}`}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        className="redBtn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="blackBtn mt-4">
            Add Guide
          </button>
        </form>
      </div>
    </div>
  )
}