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
export interface AccountModuleInterface {
  isLogin: boolean
  cstTrueName?: string
  cstEmail?: string
  cstId?: string
  token?: {
    access: string
    refresh: string
  }

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
