import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);

  if (!decoded?.exp) {
    return true;
  }

  return decoded.exp * 1000 < Date.now();
};

export const getUserRole = (token) => {
  const decoded = decodeToken(token);

  return decoded?.role ?? null;
};

export const getUserClaims = (token) => {
  return decodeToken(token);
};