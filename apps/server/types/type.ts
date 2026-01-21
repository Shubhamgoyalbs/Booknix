export interface JwtPayload {
  userId: string;
  email: string;
}

export interface JwtTokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedJwtPayload extends JwtPayload {
  iat?: number;
  exp?: number;
}

export type MiddlewareData = {
  userId: string;
  email: string;
};
