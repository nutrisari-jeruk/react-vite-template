import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { api, refreshApi } from "./apiClient";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "./tokenStorage";
import { UnauthorizedError, ValidationError, ServerError } from "./apiError";

const originalAdapter = api.defaults.adapter;
const originalRefreshAdapter = refreshApi.defaults.adapter;
function response(
  config: InternalAxiosRequestConfig,
  data: unknown
): AxiosResponse {
  return { config, data, status: 200, statusText: "OK", headers: {} };
}
function failure(config: InternalAxiosRequestConfig, status: number) {
  return Object.assign(new Error(`HTTP ${status}`), {
    isAxiosError: true,
    config,
    response: { status, data: { message: `HTTP ${status}` }, headers: {} },
  });
}
beforeEach(() => {
  clearAuthTokens();
  setAuthTokens("old-access", "old-refresh");
});
afterEach(() => {
  api.defaults.adapter = originalAdapter;
  refreshApi.defaults.adapter = originalRefreshAdapter;
  clearAuthTokens();
});
describe("refresh regression", () => {
  it("rejects and clears session when refresh itself returns 401", async () => {
    api.defaults.adapter = async (config) => {
      throw failure(config, 401);
    };
    refreshApi.defaults.adapter = async (config) => {
      throw failure(config, 401);
    };
    await expect(api.get("/private")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
  it("shares refresh across parallel requests and persists token rotation before retries", async () => {
    let calls = 0;
    refreshApi.defaults.adapter = async (config) => {
      calls++;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return response(config, {
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
      });
    };
    api.defaults.adapter = async (config) => {
      if (!config._retry) throw failure(config, 401);
      expect(config.headers.Authorization).toBe("Bearer new-access");
      expect(getRefreshToken()).toBe("new-refresh");
      return response(config, { ok: true });
    };
    await Promise.all([api.get("/one"), api.get("/two")]);
    expect(calls).toBe(1);
    expect(getAccessToken()).toBe("new-access");
  });
  for (const [status, ErrorType] of [
    [422, ValidationError],
    [500, ServerError],
  ] as const) {
    it(`preserves ${status} after a successful refresh`, async () => {
      refreshApi.defaults.adapter = async (config) =>
        response(config, {
          data: { accessToken: "new", refreshToken: "rotated" },
        });
      api.defaults.adapter = async (config) => {
        throw failure(config, config._retry ? status : 401);
      };
      await expect(api.get("/private")).rejects.toBeInstanceOf(ErrorType);
      expect(getAccessToken()).toBe("new");
    });
  }
  it("stops after one retry if the new token is also rejected", async () => {
    let calls = 0;
    refreshApi.defaults.adapter = async (config) => {
      calls++;
      return response(config, {
        data: { accessToken: "new", refreshToken: "rotated" },
      });
    };
    api.defaults.adapter = async (config) => {
      throw failure(config, 401);
    };
    await expect(api.get("/private")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(calls).toBe(1);
    expect(getAccessToken()).toBeNull();
  });
  it("does not refresh incorrect login credentials", async () => {
    let calls = 0;
    refreshApi.defaults.adapter = async (config) => {
      calls++;
      return response(config, {});
    };
    api.defaults.adapter = async (config) => {
      throw failure(config, 401);
    };
    await expect(api.post("/auth/login", {})).rejects.toBeInstanceOf(
      UnauthorizedError
    );
    expect(calls).toBe(0);
  });
  it("a refresh completing after logout cannot restore the tokens", async () => {
    let finish!: () => void;
    const started = new Promise<void>((resolve) => {
      refreshApi.defaults.adapter = async (config) => {
        resolve();
        await new Promise<void>((done) => {
          finish = done;
        });
        return response(config, {
          data: { accessToken: "late", refreshToken: "late-refresh" },
        });
      };
    });
    api.defaults.adapter = async (config) => {
      throw failure(config, 401);
    };
    const pending = api.get("/private");
    const rejected = expect(pending).rejects.toBeInstanceOf(UnauthorizedError);
    await started;
    clearAuthTokens();
    finish();
    await rejected;
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});
