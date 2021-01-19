import { UserProps, PositionProps } from '@/store/index.ts'

export const testUser: UserProps = {
  isLogin: true,
  name: 'lllll',
  id: 1,
  role: 'user'
}

export const testPosition: PositionProps = {
  breadcrum: ['在用资源', '云服务器', '云服务器列表'],
  subview: 'vmlist'
}
