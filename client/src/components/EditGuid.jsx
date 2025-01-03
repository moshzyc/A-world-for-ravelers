import React, { useEffect, useState } from "react"
import { DELETE_GUIDE_URL, GET_GUIDE_URL } from "../constants/endPoint"
import axios from "axios"
import { EditGuideWin } from "./EditGuideWin"

export const EditGuide = () => {
  const [guides, setGuides] = useState([])
  const [guideEdited, setGuidesEdited] = useState(null)

  useEffect(() => {
    getGuides()
  }, [])
  const getGuides = async () => {
    try {
      const { data } = await axios.get(GET_GUIDE_URL)
      setGuides(data)
      // console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const guideGenerator = (arr) => {
    return arr.map((item) => (
      <div
        key={item._id}
        className="border-t border-green-100 p-6 transition-colors hover:bg-green-50"
      >
        <div className="flex gap-6">
          <img
            className="h-48 w-48 rounded-lg object-cover shadow-md"
            src={item.mainImage}
            alt={item.title}
          />
          <div className="flex-1">
            <h3 className="mb-4 text-xl font-semibold text-green-800">
              {item.title}
            </h3>
            <div className="space-y-2">
              {item.content.map((paragraph, index) => (
                <div key={index} className="rounded-lg bg-green-50 p-3">
                  <p className="text-sm font-medium text-green-600">
                    Paragraph {index + 1}
                  </p>
                  <p className="mt-1 line-clamp-2 text-gray-600">{paragraph}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setGuidesEdited(item)}
              className="rounded-lg border border-green-500 px-6 py-2 text-green-600 transition-colors hover:bg-green-50"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                try {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this guide?"
                    )
                  ) {
                    await axios.delete(DELETE_GUIDE_URL + `/${item._id}`)
                  }
                } catch (error) {
                  console.error(error)
                }
              }}
              className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="divide-y divide-green-100">
      {guides.length > 0 ? (
        guideGenerator(guides)
      ) : (
        <div className="p-8 text-center text-gray-500">No guides available</div>
      )}
      {guideEdited && (
        <EditGuideWin {...guideEdited} onClose={() => setGuidesEdited(null)} />
      )}
    </div>
  )
}
