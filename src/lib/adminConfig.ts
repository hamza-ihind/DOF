import { getSession, SESSION_COOKIE } from './auth';
export const ADMIN_COOKIE_NAME = SESSION_COOKIE;
export async function isValidAdminToken(token: string | undefined) { return (await getSession(token))?.role === 'admin'; }
