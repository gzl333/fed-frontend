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

function state (): UserInterface {
  return {
    isLogin: false
  }
}

export default state
