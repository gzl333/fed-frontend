export interface UserInterface {
  isLogin: boolean;
  token?: {
    access: string;
    refresh: string;
  }
  email?: string;
}
export interface TokenInterface {
  access: string;
  refresh: string;
}
export interface LoginReqInterface {
  username: string;
  password: string;
}
export interface RefreshTokenInterface {
  refresh: string
}
export interface JwtPayloadInterface {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  username?: string;
  // eslint-disable-next-line camelcase
  token_type?: string;
}

function state () {
  return {
    isLogin: false
  }
}

export default state
