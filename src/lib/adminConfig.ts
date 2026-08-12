/**
 * ADMIN CREDENTIALS CONFIGURATION
 * 
 * You can change the admin username and password directly here in code.
 * Changes will take effect immediately upon saving this file.
 */
export const ADMIN_CREDENTIALS = {
  // Change your admin login username here:
  username: process.env.ADMIN_USERNAME || "admin",

  // Change your admin login password here:
  password: process.env.ADMIN_PASSWORD || "dof2026admin",
};

export const ADMIN_COOKIE_NAME = "dof_admin_session_token";

// Fixed internal secret token for session validation
export const ADMIN_SESSION_SECRET = "dof_secure_admin_auth_token_2026_biougra";

export function verifyAdminCredentials(user: string, pass: string): boolean {
  return user === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password;
}

export function isValidAdminToken(token: string | undefined): boolean {
  return token === ADMIN_SESSION_SECRET;
}
