export const API = {
  PRODUCTS_LIST: "https://automationexercise.com/api/productsList",
  BRANDS_LIST: "https://automationexercise.com/api/brandsList",
  SEARCH_PRODUCT: "https://automationexercise.com/api/searchProduct",
  VERIFY_LOGIN: "https://automationexercise.com/api/verifyLogin",
  CREATE_ACCOUNT: "https://automationexercise.com/api/createAccount",
  DELETE_ACCOUNT: "https://automationexercise.com/api/deleteAccount",
  UPDATE_ACCOUNT: "https://automationexercise.com/api/updateAccount",
  GET_USER_BY_EMAIL: "https://automationexercise.com/api/getUserDetailByEmail",
};

export const VALID_EMAIL = process.env.API_VALID_EMAIL || "";
export const VALID_PASSWORD = process.env.API_VALID_PASSWORD || "";
export const BAD_CREDENTIALS = "Bad credentials in .env or CI secrets.";
export const SHORT_TIMEOUT = 10000;
export const STANDARD_TIMEOUT = 15000;
