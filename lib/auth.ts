import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "distri_prono_admin";

function getPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function adminToken() {
  const password = getPassword();
  if (!password) return "";
  return createHash("sha256").update(password).digest("hex");
}

export function isValidPassword(password: string) {
  const expected = getPassword();
  return Boolean(expected) && password === expected;
}

export function isAdminRequest() {
  const cookie = cookies().get(COOKIE_NAME)?.value;
  return Boolean(cookie) && cookie === adminToken();
}

export function setAdminCookie() {
  cookies().set(COOKIE_NAME, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export function clearAdminCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
