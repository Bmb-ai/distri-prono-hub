import { NextRequest } from 'next/server';

export function isAdminRequest(request: NextRequest) {
  const password = request.headers.get('x-admin-password');
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && password && password === expected);
}
