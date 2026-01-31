import { describe, it, expect } from "vitest";
import {
  ROUTES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  QUERY_KEYS,
  HTTP_STATUS,
} from "../constants";

describe("Constants", () => {
  describe("ROUTES", () => {
    it("exposes route paths", () => {
      expect(ROUTES.HOME).toBe("/");
      expect(ROUTES.ABOUT).toBe("/about");
      expect(ROUTES.LOGIN).toBe("/login");
      expect(ROUTES.REGISTER).toBe("/register");
      expect(ROUTES.OTP).toBe("/otp");
      expect(ROUTES.NOT_FOUND).toBe("*");
    });

    it("exposes examples routes", () => {
      expect(ROUTES.EXAMPLES.ERROR_HANDLING).toBe("/examples/error-handling");
      expect(ROUTES.EXAMPLES.AUTH).toBe("/examples/auth");
      expect(ROUTES.EXAMPLES.FORM_VALIDATION).toBe("/examples/form-validation");
    });
  });

  describe("STORAGE_KEYS", () => {
    it("exposes storage key strings", () => {
      expect(STORAGE_KEYS.THEME).toBe("app-theme");
      expect(STORAGE_KEYS.LOCALE).toBe("app-locale");
      expect(STORAGE_KEYS.USER_PREFERENCES).toBe("user-preferences");
    });
  });

  describe("API_ENDPOINTS", () => {
    it("exposes auth endpoints", () => {
      expect(API_ENDPOINTS.AUTH.LOGIN).toBe("/auth/login");
      expect(API_ENDPOINTS.AUTH.REFRESH).toBe("/auth/refresh");
      expect(API_ENDPOINTS.AUTH.ME).toBe("/auth/me");
    });

    it("USERS.DETAIL returns path with id", () => {
      expect(API_ENDPOINTS.USERS.DETAIL("123")).toBe("/users/123");
      expect(API_ENDPOINTS.USERS.DETAIL("abc")).toBe("/users/abc");
    });

    it("USERS.UPDATE returns path with id", () => {
      expect(API_ENDPOINTS.USERS.UPDATE("456")).toBe("/users/456");
    });

    it("USERS.DELETE returns path with id", () => {
      expect(API_ENDPOINTS.USERS.DELETE("789")).toBe("/users/789");
    });

    it("exposes USERS list and create", () => {
      expect(API_ENDPOINTS.USERS.LIST).toBe("/users");
      expect(API_ENDPOINTS.USERS.CREATE).toBe("/users");
    });
  });

  describe("QUERY_KEYS", () => {
    it("exposes auth query keys", () => {
      expect(QUERY_KEYS.AUTH.USER).toEqual(["auth", "user"]);
    });

    it("QUERY_KEYS.USERS.DETAIL returns array with id", () => {
      expect(QUERY_KEYS.USERS.DETAIL("123")).toEqual(["users", "123"]);
      expect(QUERY_KEYS.USERS.DETAIL("user-1")).toEqual(["users", "user-1"]);
    });

    it("exposes USERS.ALL", () => {
      expect(QUERY_KEYS.USERS.ALL).toEqual(["users"]);
    });
  });

  describe("HTTP_STATUS", () => {
    it("exposes status codes", () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.CREATED).toBe(201);
      expect(HTTP_STATUS.NO_CONTENT).toBe(204);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.FORBIDDEN).toBe(403);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.CONFLICT).toBe(409);
      expect(HTTP_STATUS.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HTTP_STATUS.SERVICE_UNAVAILABLE).toBe(503);
    });
  });
});
