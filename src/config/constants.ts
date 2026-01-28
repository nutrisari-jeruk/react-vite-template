/**
 * Application-wide constants
 */

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  DASHBOARD: "/dashboard",
  COMPONENTS: "/components",
  EXAMPLES: {
    ERROR_HANDLING: "/examples/error-handling",
    AUTH: "/examples/auth",
    FORM_VALIDATION: "/examples/form-validation",
  },
  LOGIN: "/login",
  REGISTER: "/register",
  FORGET_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
  NOT_FOUND: "*",
} as const;

export const STORAGE_KEYS = {
  THEME: "app-theme",
  LOCALE: "app-locale",
  USER_PREFERENCES: "user-preferences",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    RESET_PASSWORD: "/v1/reset-password",
    SET_NEW_PASSWORD: "/v1/set-new-password",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

export const QUERY_KEYS = {
  AUTH: {
    USER: ["auth", "user"],
  },
  USERS: {
    ALL: ["users"],
    DETAIL: (id: string) => ["users", id],
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
