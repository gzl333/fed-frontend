const sampleUsageTables = {

  statusMap: {}, // todo 云主机状态的映射关系，硬写进去，一般不变
  // 以下均为object结构，也可写为map结构，则无需存储allIds，map自带全部key和顺序

  // 来源： 来自列举registry -> 无需参数，列举全部datacenter
  dataCenterTable: {
    byId: {
      id1: {
        id: 'id1',
        name: '地球大数据科学工程专项',
        endpoint_vms: 'https://vms.cstcloud.cn/',
        endpoint_object: null,
        endpoint_compute: null,
        endpoint_monitor: null,
        creation_time: '2021-02-08T01:01:00Z',
        status: {
          code: 1,
          message: '开启状态'
        },
        desc: '',

        // 以下来自其它接口
        services: ['id1'] // 关联serviceTable
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },

  // 来源：列举service -> query1: center_id / query2: available_only
  serviceTable: {
    byId: {
      id1: {
        id: 'id1',
        name: '怀柔机房一层',
        service_type: 'evcloud',
        add_time: '2020-08-28T00:29:47.396311Z',
        need_vpn: true,
        status: 1,
        data_center: 'id1', // 关联dataCenterTable 双向关联
        // 以下来自其它接口
        networks: ['id1', 'id2'],
        vpn: 'id1' // 关联vpnTable
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },

  // 来源1：列举servers -> query: service_id
  // 来源2：查询单个server -> query: server_id 不确定什么场景使用？
  serverTable: {
    byId: {
      id1: {
        id: 'id1',
        center_quota: 2, // 1: 服务的私有资源配额，"user_quota"=null; 2: 服务的分享资源配额
        creation_time: '2021-03-19T03:26:58.793601Z',
        endpoint_url: 'http://gosc.cstcloud.cn/',
        image: 'CentOS_Stream',
        ipv4: '159.226.235.62',
        name: '6c660b3707304132a787fba87bbfb56b',
        public_ip: true,
        vcpus: 1,
        ram: 1024,
        service: 'id1', // 关联serviceTable
        user_quota: 'id1', // 关联userQuotaTable
        remarks: 'zlguo@cnic.cn', // ->主动更新，patch更新后，resp中带有新的remarks

        // 以下来自不同接口的补充
        vnc: 'http://159.226.235.2/novnc/?vncid=fdb475ef-544e-4e6f-8691-0557ca8b3ee9', // 单独查询，随着serverTable更新
        status: 1 // 关联statusMap ->根据操作被动更新，云主机的操作之后，应重新获取状态数据 （增加保证成功的底层机制，即一次操作不成功则自动重试）
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },

  // 来源：列举network -> query: service_id
  networkTable: {
    byId: {
      id1: {
        id: 'id1',
        name: 'v107_dev_121-140',
        public: false,
        segment: '10.107.50.0'
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },
  // 来源： 查询vpn -> query:service_id
  // vpn接口中无id信息，其id与service_id相同
  vpnTable: {
    byId: {
      id1: {
        id: 'id1',
        username: 'testuser',
        password: 'password', // ->主动更新, patch的resp有新密码
        active: true,
        create_time: '2020-07-29T15:12:08.715731+08:00',
        modified_time: '2020-07-29T15:12:08.715998+08:00',
        // 以下来自其它接口
        ca: 'url',
        config: 'url'
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },

  // 来源: 列举uquota -> query1:service_id/query2: usable
  userQuotaTable: {
    byId: {
      id1: {
        id: 'id1',
        tag: { // 提出去单做table无用，暂时保留，不拍平
          value: 1,
          display: '普通配额'
        },
        user: { // 提出去单做table无用，暂时保留，不拍平
          id: '6',
          username: 'zlguo@cnic.cn'
        },
        service: 'id1', // 关联serviceTable
        // ->根据创建删除云主机被动更新 以下数据更新较多，逐个更新或许不如整体更新：增加或删除云主机后，应重新获取数据
        private_ip_total: 100,
        private_ip_used: 3,
        public_ip_total: 100,
        public_ip_used: 0,
        vcpu_total: 100,
        vcpu_used: 3,
        ram_total: 102400,
        ram_used: 3072,
        disk_size_total: 1000,
        disk_size_used: 0,
        expiration_time: null,
        deleted: false,
        display: '[普通配额](vCPU: 100, RAM: 102400Mb, Disk: 1000Gb, PublicIP: 100, PrivateIP: 100)',

        // 以下来自其它接口
        servers: ['id1', 'id2'] // 关联serverTable，该配额下创建的云主机id
      }
    },
    allIds: ['id1'],
    isLoaded: true
  },
  // 归档的云主机目录
  serverArchiveTable: {
    byId: {
      id1: {
        id: 'id1',
        name: '669920fef6cd49f2bf7df39fdccd03e1',
        vcpus: 1,
        ram: 1024,
        ipv4: '159.226.235.98',
        public_ip: true,
        image: 'CentOS_Stream',
        creation_time: '2021-03-15T03:10:29.600666Z',
        remarks: 'zlguo@cnic.cn',
        deleted_time: '2021-03-15T03:10:29.600706Z',
        service: 'id1', // 与serviceTable关联
        user_quota: 'id1', // 与userQuotaTable关联
        center_quota: 2, // 1: 服务的私有资源配额，"user_quota"=null; 2: 服务的分享资源配额

        user_quota_tag: 1 // 重复，应该删除
      }
    },
    allIds: ['id1'],
    isLoaded: true
  }
}

console
  .log(sampleUsageTables)
