import { normalize, schema } from 'normalizr'

// 格式化数据结构工具 -> 将数据扁平化
const originData =
  [
    {
      id: 'f6740e68-8862-11eb-ad18-c8009fe2eb02',
      name: '6c660b3707304132a787fba87bbfb56b',
      vcpus: 1,
      ram: 1024,
      ipv4: '159.226.235.62',
      public_ip: true,
      image: 'CentOS_Stream',
      creation_time: '2021-03-19T03:26:58.793601Z',
      remarks: 'zlguo@cnic.cn',
      endpoint_url: 'http://gosc.cstcloud.cn/',
      service: {
        id: '1',
        name: 'HR_204机房',
        service_type: 'evcloud'
      },
      user_quota: {
        id: '70ef572e-7fdf-11eb-b60f-c8009fe2eb02',
        tag: {
          value: 1,
          display: '普通配额'
        },
        expiration_time: null,
        deleted: false,
        display: '[普通配额](vCPU: 50, RAM: 51200Mb, PublicIP: 50, PrivateIP: 50)'
      },
      center_quota: 2
    }
  ]
const service = new schema.Entity('service')
const user_quota = new schema.Entity('user_quota')
const server = new schema.Entity('server', {
  service,
  user_quota
})
originData.forEach((data) => {
  const normalizedData = normalize(data, server)
  console.log(normalizedData)
})
