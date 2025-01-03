import React, { useContext, useState } from "react"
import { StoreContext } from "../contexts/StoreContaxtProvider"
import { EditProductWin } from "./EditProductWin"
import axios from "axios"
import { PRODUCTS_URL } from "../constants/endPoint"

export const EditProduct = () => {
  const { categories, products, setCategory, setSubCategory } =
    useContext(StoreContext)
  const [subIndex, setSubIndex] = useState(0)
  const [productEdited, setProductEdited] = useState(null)

  const categoriesGenerator = (arr) =>
    arr.map((item) => (
      <option value={item.category} key={item._id}>
        {item.category}
      </option>
    ))

  const subCategoriesGenerator = (arr) =>
    arr.map((item, index) => (
      <option value={item} key={`${item}-${index}`}>
        {item}
      </option>
    ))

  return (
    <div className="p-6">
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-green-100 p-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-green-800">Category</label>
              <select
                className="rounded-lg border border-green-200 p-2 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                onChange={(e) => {
                  const selectedIndex = e.target.selectedIndex
                  setSubIndex(selectedIndex)
                  setCategory(e.target.value)
                }}
                name="category"
              >
                {categoriesGenerator(categories)}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-green-800">Subcategory</label>
              <select
                className="rounded-lg border border-green-200 p-2 transition-colors focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                onChange={(e) => setSubCategory(e.target.value)}
                name="subCategory"
              >
                {categories[subIndex]?.subCategory ? (
                  subCategoriesGenerator(categories[subIndex].subCategory)
                ) : (
                  <option disabled>No subcategories available</option>
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-green-100">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 transition-colors hover:bg-green-50"
            >
              <div className="flex w-[70%] gap-6">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-24 w-24 rounded-lg object-cover shadow-sm"
                />
                <div className="flex flex-col justify-center gap-2">
                  <p className="text-lg font-medium text-green-800">
                    {item.title}
                  </p>
                  <p className="text-sm text-green-600">
                    Category: {item.category}
                  </p>
                  <p className="text-sm font-medium text-green-700">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setProductEdited(item)}
                  className="rounded-lg border border-green-500 px-6 py-2 text-green-600 transition-colors hover:bg-green-50"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this product?"
                      )
                    ) {
                      await axios.delete(PRODUCTS_URL + `/delete/${item._id}`)
                    }
                  }}
                  className="rounded-lg bg-red-500 px-6 py-2 text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {productEdited && (
        <EditProductWin
          {...productEdited}
          onClose={() => setProductEdited(null)}
        />
      )}
    </div>
  )
}
