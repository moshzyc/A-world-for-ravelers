const BASE_URL = "http://localhost:3000/"
const PRODUCTS_URL = BASE_URL + "products"
const GUIDE_URL = BASE_URL + "guide/"
const USER_URL = BASE_URL + "user/"

const SIGNUP_URL = USER_URL + "signup"
const LOGIN_URL = USER_URL + "login"
const LOGOUT_URL = USER_URL + "logout"
const GET_INFO_URL = USER_URL + "info"
const CART_URL = USER_URL + "cart"
const ORDER_URL = USER_URL + "save-order"
const ADD_PRODUCT_URL = PRODUCTS_URL + "/add"
const EDIT_PRODUCT_URL = PRODUCTS_URL + "/update/"
const GET_CATEGORIES_URL = PRODUCTS_URL + "/categories"
const ADD_GUIDE_URL = GUIDE_URL + "add"
const DELETE_GUIDE_URL = GUIDE_URL + "delete"
const EDIT_GUIDE_URL = GUIDE_URL + "update"
const GET_GUIDE_URL = GUIDE_URL + "get"

export {
  SIGNUP_URL,
  LOGIN_URL,
  GET_INFO_URL,
  LOGOUT_URL,
  PRODUCTS_URL,
  GET_CATEGORIES_URL,
  CART_URL,
  ORDER_URL,
  ADD_PRODUCT_URL,
  EDIT_PRODUCT_URL,
  USER_URL,
  ADD_GUIDE_URL,
  EDIT_GUIDE_URL,
  GET_GUIDE_URL,
  DELETE_GUIDE_URL,
}
