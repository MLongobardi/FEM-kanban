import { dev } from "$app/environment";

const FORCE_TEST = true; //priority
const FORCE_COOKIES = false;

export function getId(cookies) {
	if (FORCE_TEST) return "test";
	if (FORCE_COOKIES) return cookies.get("userId");
	if (dev) return "test";
	return cookies.get("userId");
}

export function getCookieExpireDate(t = 365 * 24 * 3600 * 1000) {
	return new Date(new Date().getTime() + t);
}