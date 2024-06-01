const isLogggedIn = "isLoggedIn";
const userType = "type";

/**
 * The function `removeToken` removes item from the localStorage.
 */
export const removeLoginToken = () => {
  localStorage.removeItem(isLogggedIn);
};

export const removeTypeToken = () => {
  localStorage.removeItem(userType);
};

/**
 * The addToken function sets a token value in the localStorage.
 * @param token - The `token` parameter is a string that represents a token value.
 */
export const addLoginToken = (token:string) => {
  localStorage.setItem(isLogggedIn, token);
};

export const addTypeToken = (token:string) => {
  localStorage.setItem(userType, token);
};

/**
 * The function `getToken` retrieves a token from the local storage.
 * @returns The function `getToken` returns the value stored in the `x` variable, which is retrieved
 * from the `localStorage` using the `getItem` method.
 */
export const getLoginToken = () => {
  const x = localStorage.getItem(isLogggedIn);
  return x;
};
export const getTypeToken = () => {
  const x = localStorage.getItem(userType);
  return x;
};
