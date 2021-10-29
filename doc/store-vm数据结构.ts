const vm = {
  // 组件本地数据
  components: {},
  // 页面本地数据
  pages: {},
  // 扁平结构的表数据
  tables: {
    statusMap: new Map(), // 云主机状态的映射关系，硬写进去，一般不变
    // 以下均为object结构。 不可写为map结构！因vuex不支持对map结构mutation的探测，只支持proxy object
    /*
    table分为两种：global table，保存系统内部全部相关数据；user table，只保存与当前用户相关的table
    */
    // 来源： 来自列举registry -> 无需参数，列举全部datacenter
    globalDataCenterTable: {
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

    // 来源：查询flavor 无参数
    globalFlavorTable: {
      byId: {
        id1: {
          id: 'id1',
          vcpus: 1,
          ram: 1024
        }
      },
      allIds: [],
      isLoaded: true
    },

    // 来源：列举service -> query1: center_id / query2: available_only
    userServiceTable: {
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

    // 来源：列举network -> query: service_id
    userNetworkTable: {
      byLocalId: {
        'id1-id2': { // ***与service_id拼接后的id*** 原始id在系统中不唯一
          id: 'id2', // 原始id
          localId: 'id1-id2',
          name: 'v107_dev_121-140',
          public: false,
          segment: '10.107.50.0',
          // 根据查询时所填的serviceId补充
          service: 'id1'
        }
      },
      allLocalIds: ['id1-id2'],
      isLoaded: true
    },

    // 来源： 列举image -> query: service_id
    userImageTable: {
      byLocalId: {
        'id1-id2': { // ***与service_id拼接后的id*** 原始id在系统中不唯一
          id: 'id2', // 原始id
          localId: 'id1-id2', // id1是service_id, id2是image原始id
          name: 'Ubuntu_2004',
          system: 'Ubuntu_2004',
          system_type: 'Linux',
          creation_time: '0001-01-01T00:00:00Z',
          desc: '',
          default_user: 'string', // 当前image的默认用户名和密码
          default_password: 'string',
          // 根据查询时所填的serviceId补充
          service: 'id1'
        }
      },
      allLocalIds: ['id1-id2'],
      isLoaded: true
    },

    // 来源： 查询vpn -> query:service_id
    // vpn table应有两个依赖，user service和user server，任何一个出现了某个service，都应把该service的vpn补充进来
    // 注意： service可以没有VPN ！！！
    userVpnTable: {
      byId: {
        id1: {
          id: 'id1', // vpn接口中无id信息，其id与service_id相同
          username: 'testuser',
          password: 'password', // ->主动更新, patch的resp有新密码
          active: true,
          create_time: '2020-07-29T15:12:08.715731+08:00',
          modified_time: '2020-07-29T15:12:08.715998+08:00',
          // 以下来自其它接口
          ca: 'url', // 不保存在vuex中，需要时单独获取并跳转
          config: 'url' // 不保存在vuex中，需要时单独获取并跳转
        }
      },
      allIds: ['id1'],
      isLoaded: {
        server: true, // 是否根据userServerTable更新过
        service: true // 是否根据userServiceTable更新过
      }
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
          display: '[普通配额](vCPU: 100, RAM: 102400Mb, Disk: 1000Gb, PublicIP: 100, PrivateIP: 100)',
          expiration_time: null, // 过期时间。 和deleted共同决定该配额是否可用：其中一项即可决定该配额是否有效
          deleted: false, // 用户或管理员删除配额
          duration_days: 110,
          classification: 'vo', // vo：vo组配额申请；personal：用户个人配额申请
          vo: { // "classification"=="vo"时存在；"classification"=="personal"时为null
            id: '3d7cd5fc-d236-11eb-9da9-c8009fe2eb10',
            name: '项目组1',
            company: '网络中心',
            description: '的是',
            creation_time: '2021-06-21T02:13:16.663967Z',
            owner: {
              id: '1',
              username: 'shun'
            },
            status: 'active'
          },

          // 以下来自quota-server接口
          servers: ['id1', 'id2'], // 关联serverTable，该配额下创建的云主机id

          // 以下为根据上述字段自行判断填充
          expired: false,
          exhausted: false
        }
      },
      allIds: ['id1'],
      isLoaded: true
    },

    // 来源1：列举servers -> query: service_id
    // 来源2：查询单个server -> query: server_id 不确定什么场景使用？
    userServerTable: {
      byId: {
        id1: {
          id: 'id1',
          creation_time: '2021-03-19T03:26:58.793601Z',
          endpoint_url: 'http://gosc.cstcloud.cn/',
          image: 'CentOS_Stream', // server创建时的操作操作系统名称
          ipv4: '159.226.235.62',
          name: '6c660b3707304132a787fba87bbfb56b',
          public_ip: true,
          vcpus: 1,
          ram: 1024,
          service: 'id1', // 关联serviceTable
          user_quota: 'id1', // 关联userQuotaTable
          center_quota: 2, // 1: 服务的私有资源配额，"user_quota"=null; 2: 服务的分享资源配额
          remarks: 'zlguo@cnic.cn', // ->主动更新，patch更新后，resp中带有新的remarks
          classification: 'personal', // 个人还是组
          image_id: '',
          image_desc: '',
          default_user: 'root',
          default_password: 'cnic.cn',
          vo_id: null, // 组id
          user: { // 创建者, 暂不normailize
            id: '6',
            username: 'zlguo@cnic.cn'
          },

          // 以下来自不同接口的补充
          vnc: 'http://159.226.235.2/novnc/?vncid=fdb475ef-544e-4e6f-8691-0557ca8b3ee9', // todo 单独查询，然后给serverTable补充更新
          status: 1 // 关联statusMap ->根据操作被动更新，云主机的操作之后，应重新获取状态数据 （增加保证成功的底层机制，即一次操作不成功则自动重试）
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
          center_quota: 2 // 1: 服务的私有资源配额，"user_quota"=null; 2: 服务的分享资源配额
        }
      },
      allIds: ['id1'],
      isLoaded: true
    }
  }

}

console.log(vm)
