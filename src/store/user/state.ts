
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
export interface CstJwtInterface {
  trueName: string;
  type: string;
  umtId: string;
  securityEmail: string;
  cstnetIdStatus: string;
  cstnetId: string;
  expiration:number;
  iss: string;
  iat: number;
}

export interface UserInterface {
  isLogin: boolean;
  cstTrueName?: string;
  cstEmail?: string;
  cstId?: string;
  token?: {
    access: string;
    refresh: string;
  }
}

function state () {
  return {
    isLogin: false
  }
}

export default state
