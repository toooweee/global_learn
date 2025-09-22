export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export type JwtVerifyPayload = JwtPayload & {
  iat?: number;
  exp?: number;
};
