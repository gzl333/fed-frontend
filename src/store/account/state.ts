export interface TokenInterface {
  access: string
  refresh: string
}

export interface CstJwtInterface {
  trueName: string
  type: string
  umtId: string
  securityEmail: string
  cstnetIdStatus: string
  cstnetId: string
  exp: number
  iss: string
  iat: number
}

// Account总体类型
export interface AccountInterface {
  isLogin: boolean
  cstTrueName?: string
  cstEmail?: string
  cstId?: string
  token?: {
    access: string
    refresh: string
  }

  // myLaylou rightDrawer open
  isRightDrawerOpen: boolean
}

function state () {
  return {
    isLogin: false,
    isRightDrawerOpen: false
  }
}

export default state
