export interface UserInterface {
  isLogin: boolean;
  token?: {
    access: string;
    refresh: string;
  }
  email?: string
}
export interface ApiJwtInterface {
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

function state () {
  return {
    isLogin: false
  }
}

export default state
