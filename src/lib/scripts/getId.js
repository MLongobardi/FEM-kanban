import { dev } from "$app/environment";

const FORCE_TEST = false; //priority
const FORCE_COOKIES = false;

export default function getId(cookies) {
	if (FORCE_TEST) return ("test");
	if (FORCE_COOKIES) return cookies.get("userId");
	if (dev) return "test";
	return cookies.get("userId");
}
