export interface DecodedToken {
  cstnetId: string // cst email
  cstnetIdStatus: string
  exp: number
  iat: number
  iss: string
  orgName: string
  securityEmail: null // ?
  trueName: string
  type: string
  umtId: string
}

// Account总体类型
export interface AccountModuleInterface {
  // account
  isLogin: boolean
  access?: string
  refresh?: string
  decoded?: DecodedToken

  // layout
  isRightDrawerOpen: boolean
  isFooterOpen: boolean
}

function state (): AccountModuleInterface {
  return {
    isLogin: false,
    isRightDrawerOpen: false,
    isFooterOpen: false
  }
}

export default state
