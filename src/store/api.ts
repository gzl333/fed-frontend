// todo 核对准确
// 标准api调用函数库,与接口一致
import { apiFed /*, apiLogin */ } from 'boot/axios'

const api = {
  login: {},
  apply: {
    getApplyOrganization (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; status?: 'wait' | 'cancel' | 'pending' | 'reject' | 'pass' } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/organization', config)
    },
    postApplyOrganization (payload: { body: { name: string; name_en: string; abbreviation: string; independent_legal_person: boolean; country: string; city: string; postal_code?: string; address: string; endpoint_vms?: string; endpoint_object?: string; endpoint_compute?: string; endpoint_monitor?: string; desc?: string; logo_url?: string; certification_url?: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/apply/organization', config)
    },
    getApplyOrganizationAdmin (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; status?: 'wait' | 'cancel' | 'pending' | 'reject' | 'pass' } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/organization/admin', config)
    },
    deleteApplyOrganization (payload: { path: { id: string } }) {
      return apiFed.delete('/apply/organization/' + payload.path.id)
    },
    postApplyOrganizationAction (payload: { path: { action: string; id: string } }) {
      return apiFed.post('/apply/organization/' + payload.path.id + '/action/' + payload.path.action)
    },
    getApplyQuota (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/quota', config)
    },
    postApplyQuota (payload: { body: { vo_id?: string; service_id: string; private_ip?: number; public_ip?: number; vcpu?: number; ram?: number; disk_size?: number; duration_days: number; company?: string; contact?: string; purpose?: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/apply/quota', config)
    },
    getApplyQuotaAdmin (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/quota/admin', config)
    },
    getApplyQuotaVo (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] }, path: { vo_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/quota/vo/' + payload.path.vo_id, config)
    },
    getApplyQuotaApplyId (payload: { path: { apply_id: string } }) {
      return apiFed.get('/apply/quota/' + payload.path.apply_id)
    },
    patchApplyQuota (payload: { body: { service_id: string; private_ip: number; public_ip: number; vcpu: number; ram: number; disk_size: number; duration_days: number; company: string; contact: string; purpose: string }, path: { apply_id: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.patch('/apply/quota/' + payload.path.apply_id, config)
    },
    deleteApplyQuota (payload: { path: { apply_id: string } }) {
      return apiFed.delete('/apply/quota/' + payload.path.apply_id)
    },
    getApplyQuotaApplyIdAdmin (payload: { path: { apply_id: string } }) {
      return apiFed.get('/apply/quota/' + payload.path.apply_id + '/admin')
    },
    postApplyQuotaApplyIdCancel (payload: { path: { apply_id: string } }) {
      return apiFed.post('/apply/quota/' + payload.path.apply_id + '/cancel')
    },
    postApplyQuotaApplyIdPass (payload: { path: { apply_id: string } }) {
      return apiFed.post('/apply/quota/' + payload.path.apply_id + '/pass')
    },
    postApplyQuotaApplyIdPending (payload: { path: { apply_id: string } }) {
      return apiFed.post('/apply/quota/' + payload.path.apply_id + '/pending')
    },
    postApplyQuotaApplyIdReject (payload: { path: { apply_id: string }, body: { reason: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/apply/quota/' + payload.path.apply_id + '/reject', config)
    },
    getApplyService (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; organization?: string; status?: string[] } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/service', config)
    },
    postApplyService (payload: { body: { organization_id: string; name: string; name_en: string; service_type: string; endpoint_url: string; region?: string; api_version?: string; username: string; password: string; project_name?: string; project_domain_name?: string; user_domain_name?: string; remarks?: string; need_vpn: boolean; vpn_endpoint_url?: string; vpn_api_version?: string; vpn_username?: string; vpn_password?: string; longitude?: number; latitude?: number; contact_person: string; contact_email: string; contact_telephone: string; contact_fixed_phone?: string; contact_address: string; logo_url?: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/apply/service', config)
    },
    getApplyServiceAdmin (payload: { query?: { page?: number; page_size?: number; deleted?: boolean; organization?: string; status?: string[] } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/apply/service/admin', config)
    },
    deleteApplyService (payload: { path: { id: string } }) {
      return apiFed.delete('/apply/service/' + payload.path.id)
    },
    postApplyServiceAction (payload: { path: { action: string; id: string } }) {
      return apiFed.post('/apply/service/' + payload.path.id + '/action/' + payload.path.action)
    }
  },
  flavor: {
    getFlavor () {
      return apiFed.get('/flavor')
    }
  },
  image: {
    getImage (payload: { query: { service_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/image', config)
    }
  },
  media: {
    getMedia (payload: { path: { url_path: string } }) {
      return apiFed.get('/media/' + payload.path.url_path)
    },
    putMedia (payload: { path: { url_path: string }, body: { data: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.put('/media/' + payload.path.url_path, config)
    }
  },
  monitor: {
    getMonitorCephQuery (payload: { query: { service_id: string; query: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/monitor/ceph/query', config)
    },
    getMonitorCephQueryRange (payload: { query: { service_id: string; query: string; start: number; end?: number; step?: number } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/monitor/ceph/query/range', config)
    },

    getMonitorServerQuery (payload: { query: { service_id: string; query: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/monitor/server/query', config)
    }
  },
  network: {
    getNetwork (payload: { query: { service_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/network', config)
    },
    getNetworkNetworkId (payload: { query: { service_id: string }, path: { network_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/network/' + payload.path.network_id, config)
    }
  },
  quota: {
    getQuota (payload: { query?: { page?: number; page_size?: number; service?: string; usable?: boolean; deleted?: boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/quota', config)
    },
    getQuotaVo (payload: { query?: { page?: number; page_size?: number; service?: string; usable?: boolean }, path: { vo_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/quota/vo/' + payload.path.vo_id, config)
    },
    getQuotaId (payload: { query: { 'as-admin': boolean }, path: { id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/quota/vo/' + payload.path.id, config)
    },
    deleteQuotaId (payload: { path: { id: string } }) {
      return apiFed.get('/quota/' + payload.path.id)
    },
    getQuotaServers (payload: { query?: { page?: number; page_size?: number; }, path: { id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/quota/' + payload.path.id + '/servers', config)
    }
  },
  quota_activity: {
    getQuotaActivity (payload: { query?: { page?: number; page_size?: number; status: string; 'exclude-not-start': boolean; 'exclude-ended': boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/quota-activity', config)
    },
    postQuotaActivity (payload: { body: { service_id: string; name: string; name_en: string; start_time: string; end_time: string; count: number; times_per_user: number; status: string; tag: string; cpus: number; private_ip: number; public_ip: number; ram: number; disk_size: number; expiration_time: string; duration_days: number } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/quota-activity', config)
    },
    getQuotaActivityGet (payload: { path: { id: string } }) {
      return apiFed.get('/quota-activity/' + payload.path.id + '/get')
    }
  },
  registry: {
    getRegistry () {
      return apiFed.get('/registry')
    }
  },
  server: {
    getServer (payload: { query?: { page?: number; page_size?: number; service_id?: string; user_id?: string; vo_id?: string; 'as-admin': boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server', config)
    },
    postServer (payload: { body: { service_id: string; image_id: string; flavor_id: string; network_id?: string; quota_id: string; remarks?: string; } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/server', config)
    },
    getServerVo (payload: { path: { vo_id: string }, query?: { page?: number; page_size?: number; service_id?: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server/vo/' + payload.path.vo_id, config)
    },
    getServerId (payload: { path: { id: string }, query: { 'as-admin': boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server/' + payload.path.id, config)
    },
    deleteServer (payload: { path: { id: string }, query?: { force?: boolean } }) {
      const config = {
        data: payload.query
      }
      return apiFed.delete('/server/' + payload.path.id, config)
    },
    postServerAction (payload: { path: { id: string }, body: { action: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/server/' + payload.path.id + '/action', config)
    },
    postServerLock (payload: { path: { id: string }, query: { lock: string } }) {
      const config = {
        data: payload.query
      }
      return apiFed.post('/server/' + payload.path.id + '/lock', config)
    },
    patchServerRemark (payload: { path: { id: string }, query: { remark: string } }) {
      const config = {
        data: payload.query
      }
      return apiFed.patch('/server/' + payload.path.id + '/remark', config)
    },
    getServerStatus (payload: { path: { id: string }, query: { 'as-admin': string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server/' + payload.path.id + '/status', config)
    },
    getServerVnc (payload: { path: { id: string } }) {
      return apiFed.get('/server/' + payload.path.id + '/vnc')
    }
  },
  server_archive: {
    getServerArchive (payload: { query?: { page?: number; page_size?: number; service_id?: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server-archive', config)
    },
    getServerArchiveVo (payload: { query?: { page?: number; page_size?: number; service_id?: string }, path: { vo_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/server-archive/vo/' + payload.path.vo_id, config)
    }
  },
  service: {
    getService (payload: { query?: { page?: number; page_size?: number; center_id?: string; available_only?: boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/service', config)
    },
    getServiceAdmin (payload: { query?: { page?: number; page_size?: number } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/service/admin', config)
    },
    getServiceVo (payload: { query?: { page?: number; page_size?: number; center_id?: string }, path: { vo_id: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/service/vo/' + payload.path.vo_id, config)
    },
    getServicePQuota (payload: { path: { id: string } }) {
      return apiFed.get('/service/' + payload.path.id + '/p-quota')
    },
    postServicePQuota (payload: { body: { private_ip_total: number; public_ip_total: number; vcpu_total: number; ram_total: number; disk_size_total: number; }, path: { id: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/service/' + payload.path.id + '/p-quota', config)
    },
    getServiceSQuota (payload: { path: { id: string } }) {
      return apiFed.get('/service/' + payload.path.id + '/s-quota')
    },
    postServiceSQuota (payload: { body: { private_ip_total: number; public_ip_total: number; vcpu_total: number; ram_total: number; disk_size_total: number; }, path: { id: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/service/' + payload.path.id + '/s-quota', config)
    }
  },
  user: {
    getUserAccount (payload: { query?: { page?: number; page_size?: number } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/user/account', config)
    }
    // todo  getUserPermissionPolicy
  },
  vms: {
    getVmsServicePQuota (payload: { query?: { page?: number; page_size: number; service_id?: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/vms/service/p-quota', config)
    }
  },
  vo: {
    getVmsServiceSQuota (payload: { query?: { page?: number; page_size: number; service_id?: string } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/vms/service/s-quota', config)
    },
    getVo (payload: { query?: { page?: number; page_size?: number; owner?: boolean; member?: boolean } }) {
      const config = {
        params: payload.query
      }
      return apiFed.get('/vo', config)
    },
    postVo (payload: { body: { name: string; company: string; description: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/vo', config)
    },
    postVoMembersRole (payload: { path: { member_id: string; role: string } }) {
      return apiFed.post('/vo/members/' + payload.path.member_id + '/role/' + payload.path.role)
    },
    patchVo (payload: { path: { id: string }, body: { data: { name: string; company: string; description: string } } }) {
      const config = {
        data: payload.body
      }
      return apiFed.patch('/vo/' + payload.path.id, config)
    },
    deleteVo (payload: { path: { id: string } }) {
      return apiFed.delete('/vo/' + payload.path.id)
    },
    postVoAddMembers (payload: { path: { id: string }, body: { usernames: string[] } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/vo/' + payload.path.id + '/add-members', config)
    },
    getVoListMembers (payload: { path: { id: string } }) {
      return apiFed.get('/vo/' + payload.path.id + 'list-members')
    },
    postVoRemoveMembers (payload: { path: { id: string }, body: { usernames: string[] } }) {
      const config = {
        data: payload.body
      }
      return apiFed.post('/vo/' + payload.path.id + '/remove-members', config)
    }
  },
  vpn: {
    getVpn (payload: { path: { service_id: string } }) {
      return apiFed.get('/vpn/' + payload.path.service_id)
    },
    patchVpn (payload: { path: { service_id: string }, body: { password: string } }) {
      const config = {
        data: payload.body
      }
      return apiFed.patch('/vpn/' + payload.path.service_id, config)
    },
    getVpnCa (payload: { path: { service_id: string } }) {
      return apiFed.get('/vpn/' + payload.path.service_id + '/ca')
    },
    getVpnConfig (payload: { path: { service_id: string } }) {
      return apiFed.get('/vpn/' + payload.path.service_id + '/config')
    }
  }
}

export default api
