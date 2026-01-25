/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are present and valid
 */

interface EnvConfig {
  // Application Configuration
  appName: string;
  appUrl: string;
  appEnv: "development" | "staging" | "production";

  // API Configuration
  apiUrl: string;
  apiTimeout: number;

  // Authentication
  authTokenKey: string;
  authRefreshTokenKey: string;
  authTokenRefreshInterval: number;

  // Cache Configuration
  queryCacheTime: number;
  queryStaleTime: number;
  queryRetryDelay: number;
  queryRetryTimes: number;

  // UI Configuration
  theme: string;
  locale: string;
  dateFormat: string;

  // Pagination
  defaultPageSize: number;
  maxPageSize: number;

  // Upload Configuration
  maxFileSize: number;
  allowedFileTypes: string[];

  // Maintenance Mode
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

/**
 * Validates that a required environment variable exists
 */
function requireEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key] || defaultValue;

  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }

  return value;
}

/**
 * Converts a string to boolean
 */
function toBoolean(value: string, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value === "true" || value === "1" || value === "yes";
}

/**
 * Converts a string to number with validation
 */
function toNumber(
  value: string,
  defaultValue: number,
  min?: number,
  max?: number
): number {
  const num = parseInt(value, 10);
  if (isNaN(num)) return defaultValue;

  if (min !== undefined && num < min) {
    console.warn(
      `Value ${value} is below minimum ${min}, using ${defaultValue}`
    );
    return defaultValue;
  }

  if (max !== undefined && num > max) {
    console.warn(
      `Value ${value} exceeds maximum ${max}, using ${defaultValue}`
    );
    return defaultValue;
  }

  return num;
}

/**
 * Validates URL format
 * Accepts both absolute URLs and relative paths (starting with /)
 */
function validateUrl(url: string): string {
  // Allow relative paths for API URLs (e.g., /api)
  if (url.startsWith("/")) {
    return url;
  }

  try {
    new URL(url);
    return url;
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
}

/**
 * Export validated environment configuration
 */
export const env: EnvConfig = (() => {
  try {
    return {
      // Application Configuration
      appName: requireEnv("VITE_APP_NAME", "React App"),
      appUrl: validateUrl(requireEnv("VITE_APP_URL", "http://localhost:3000")),
      appEnv: (() => {
        const envValue = requireEnv("VITE_APP_ENV", "development");
        const validEnvs = ["development", "staging", "production"];
        if (!validEnvs.includes(envValue)) {
          console.warn(
            `Invalid VITE_APP_ENV: ${envValue}, using 'development'`
          );
          return "development";
        }
        return envValue as "development" | "staging" | "production";
      })(),

      // API Configuration
      apiUrl: validateUrl(requireEnv("VITE_API_URL", "/api")),
      apiTimeout: toNumber(
        requireEnv("VITE_API_TIMEOUT", "10000"),
        10000,
        1000,
        60000
      ),

      // Authentication
      authTokenKey: requireEnv("VITE_AUTH_TOKEN_KEY", "token"),
      authRefreshTokenKey: requireEnv(
        "VITE_AUTH_REFRESH_TOKEN_KEY",
        "refreshToken"
      ),
      authTokenRefreshInterval: toNumber(
        requireEnv("VITE_AUTH_TOKEN_REFRESH_INTERVAL", "300000"),
        300000,
        0
      ),

      // Cache Configuration
      queryCacheTime: toNumber(
        requireEnv("VITE_QUERY_CACHE_TIME", "300000"),
        300000,
        0
      ),
      queryStaleTime: toNumber(
        requireEnv("VITE_QUERY_STALE_TIME", "60000"),
        60000,
        0
      ),
      queryRetryDelay: toNumber(
        requireEnv("VITE_QUERY_RETRY_DELAY", "1000"),
        1000,
        0
      ),
      queryRetryTimes: toNumber(
        requireEnv("VITE_QUERY_RETRY_TIMES", "3"),
        3,
        0,
        5
      ),

      // UI Configuration
      theme: requireEnv("VITE_THEME", "default"),
      locale: requireEnv("VITE_LOCALE", "en-US"),
      dateFormat: requireEnv("VITE_DATE_FORMAT", "YYYY-MM-DD"),

      // Pagination
      defaultPageSize: toNumber(
        requireEnv("VITE_DEFAULT_PAGE_SIZE", "10"),
        10,
        1,
        100
      ),
      maxPageSize: toNumber(
        requireEnv("VITE_MAX_PAGE_SIZE", "100"),
        100,
        1,
        1000
      ),

      // Upload Configuration
      maxFileSize: toNumber(
        requireEnv("VITE_MAX_FILE_SIZE", "10485760"),
        10485760,
        1024
      ),
      allowedFileTypes: requireEnv(
        "VITE_ALLOWED_FILE_TYPES",
        ".jpg,.jpeg,.png,.pdf"
      )
        .split(",")
        .map((ext) => ext.trim())
        .filter((ext) => ext.startsWith(".")),

      // Maintenance Mode
      maintenanceMode: toBoolean(import.meta.env.VITE_MAINTENANCE_MODE, false),
      maintenanceMessage: requireEnv("VITE_MAINTENANCE_MESSAGE", ""),
    };
  } catch (error) {
    console.error("Environment configuration error:", error);

    if (import.meta.env.DEV) {
      console.error(`
=============================================
ENVIRONMENT CONFIGURATION ERROR
=============================================
${error instanceof Error ? error.message : "Unknown error"}

Please create a .env file from .env.example:
  cp .env.example .env

Then configure the required variables.
=============================================
      `);
    }

    throw error;
  }
})();

/**
 * Helper to check if we're in development mode
 */
export const isDevelopment = env.appEnv === "development";

/**
 * Helper to check if we're in production mode
 */
export const isProduction = env.appEnv === "production";

/**
 * Helper to check if we're in staging mode
 */
export const isStaging = env.appEnv === "staging";
