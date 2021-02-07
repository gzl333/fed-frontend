import { UserProps, PositionProps } from '@/store/index.ts'

export const testUserLogged: UserProps = {
  isLogin: true,
  name: 'TestUser@user',
  id: 1,
  role: 'user'
}

export const testUserNotLogged: UserProps = {
  isLogin: false,
  name: 'TestUser@user',
  id: 2,
  role: 'user'
}

export const testPosition: PositionProps = ['在用资源', '云服务器', '云服务器列表']
