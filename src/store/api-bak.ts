/* apply */
import { ActionContext } from 'vuex'
import { apiBase } from 'src/store'
import axios from 'axios'

export function getApplyOrganization<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; status?: 'wait' | 'cancel' | 'pending' | 'reject' | 'pass' } }) {
  const api = apiBase + '/apply/organization'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postApplyOrganization<S, R> (context: ActionContext<S, R>, payload: { body: { name: string; name_en: string; abbreviation: string; independent_legal_person: boolean; country: string; city: string; postal_code?: string; address: string; endpoint_vms?: string; endpoint_object?: string; endpoint_compute?: string; endpoint_monitor?: string; desc?: string; logo_url?: string; certification_url?: string } }) {
  const api = apiBase + '/apply/organization'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getApplyOrganizationAdmin<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; status?: 'wait' | 'cancel' | 'pending' | 'reject' | 'pass' } }) {
  const api = apiBase + '/apply/organization/admin'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function deleteApplyOrganization<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/apply/organization/' + payload.path.id
  return axios.delete(api)
}

export function postApplyOrganizationAction<S, R> (context: ActionContext<S, R>, payload: { path: { action: string; id: string } }) {
  const api = apiBase + '/apply/organization/' + payload.path.id + '/action/' + payload.path.action
  return axios.post(api)
}

export function getApplyQuota<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] } }) {
  const api = apiBase + '/apply/quota'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postApplyQuota<S, R> (context: ActionContext<S, R>, payload: { body: { vo_id?: string; service_id: string; private_ip?: number; public_ip?: number; vcpu?: number; ram?: number; disk_size?: number; duration_days: number; company?: string; contact?: string; purpose?: string } }) {
  const api = apiBase + '/apply/quota'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getApplyQuotaAdmin<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] } }) {
  const api = apiBase + '/apply/quota/admin'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getApplyQuotaVo<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; service?: string; status?: string[] }, path: { vo_id: string } }) {
  const api = apiBase + '/apply/quota/vo/' + payload.path.vo_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getApplyQuotaApplyId<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id
  return axios.get(api)
}

export function patchApplyQuota<S, R> (context: ActionContext<S, R>, payload: { body: { service_id: string; private_ip: number; public_ip: number; vcpu: number; ram: number; disk_size: number; duration_days: number; company: string; contact: string; purpose: string }, path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id
  const config = {
    data: payload.body
  }
  return axios.patch(api, config)
}

export function deleteApplyQuota<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id
  return axios.delete(api)
}

export function getApplyQuotaApplyIdAdmin<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/admin'
  return axios.get(api)
}

export function postApplyQuotaApplyIdCancel<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/cancel'
  return axios.post(api)
}

export function postApplyQuotaApplyIdPass<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/pass'
  return axios.post(api)
}

export function postApplyQuotaApplyIdPending<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/pending'
  return axios.post(api)
}

export function postApplyQuotaApplyIdReject<S, R> (context: ActionContext<S, R>, payload: { path: { apply_id: string }, body: { reason: string } }) {
  const api = apiBase + '/apply/quota/' + payload.path.apply_id + '/reject'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getApplyService<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; organization?: string; status?: string[] } }) {
  const api = apiBase + '/apply/service'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postApplyService<S, R> (context: ActionContext<S, R>, payload: { body: { organization_id: string; name: string; name_en: string; service_type: string; endpoint_url: string; region?: string; api_version?: string; username: string; password: string; project_name?: string; project_domain_name?: string; user_domain_name?: string; remarks?: string; need_vpn: boolean; vpn_endpoint_url?: string; vpn_api_version?: string; vpn_username?: string; vpn_password?: string; longitude?: number; latitude?: number; contact_person: string; contact_email: string; contact_telephone: string; contact_fixed_phone?: string; contact_address: string; logo_url?: string } }) {
  const api = apiBase + '/apply/service'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getApplyServiceAdmin<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; deleted?: boolean; organization?: string; status?: string[] } }) {
  const api = apiBase + '/apply/service/admin'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function deleteApplyService<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/apply/service/' + payload.path.id
  return axios.delete(api)
}

export function postApplyServiceAction<S, R> (context: ActionContext<S, R>, payload: { path: { action: string; id: string } }) {
  const api = apiBase + '/apply/service/' + payload.path.id + '/action/' + payload.path.action
  return axios.post(api)
}

export function getFlavor () {
  const api = apiBase + '/flavor'
  return axios.get(api)
}

export function getImage<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string } }) {
  const api = apiBase + '/image'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getMedia<S, R> (context: ActionContext<S, R>, payload: { path: { url_path: string } }) {
  const api = apiBase + '/media/' + payload.path.url_path
  return axios.get(api)
}

export function putMedia<S, R> (context: ActionContext<S, R>, payload: { path: { url_path: string }, body: { data: string } }) {
  const api = apiBase + '/media/' + payload.path.url_path
  const config = {
    data: payload.body
  }
  return axios.put(api, config)
}

export function getMonitorCephQuery<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string; query: string } }) {
  const api = apiBase + '/monitor/ceph/query'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getMonitorCephQueryRange<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string; query: string; start: number; end?: number; step?: number } }) {
  const api = apiBase + '/monitor/ceph/query/range'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getMonitorServerQuery<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string; query: string } }) {
  const api = apiBase + '/monitor/server/query'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getNetwork<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string } }) {
  const api = apiBase + '/network'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getNetworkNetworkId<S, R> (context: ActionContext<S, R>, payload: { query: { service_id: string }, path: { network_id: string } }) {
  const api = apiBase + '/network/' + payload.path.network_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getQuota<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; service?: string; usable?: boolean; deleted?: boolean } }) {
  const api = apiBase + '/quota'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getQuotaVo<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; service?: string; usable?: boolean }, path: { vo_id: string } }) {
  const api = apiBase + '/quota/vo/' + payload.path.vo_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getQuotaId<S, R> (context: ActionContext<S, R>, payload: { query: { 'as-admin': boolean }, path: { id: string } }) {
  const api = apiBase + '/quota/vo/' + payload.path.id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function deleteQuotaId<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/quota/' + payload.path.id
  return axios.get(api)
}

export function getQuotaServers<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; }, path: { id: string } }) {
  const api = apiBase + '/quota/' + payload.path.id + '/servers'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getQuotaActivity<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; status: string; 'exclude-not-start': boolean; 'exclude-ended': boolean } }) {
  const api = apiBase + '/quota-activity'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postQuotaActivity<S, R> (context: ActionContext<S, R>, payload: { body: { service_id: string; name: string; name_en: string; start_time: string; end_time: string; count: number; times_per_user: number; status: string; tag: string; cpus: number; private_ip: number; public_ip: number; ram: number; disk_size: number; expiration_time: string; duration_days: number } }) {
  const api = apiBase + '/quota-activity'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getQuotaActivityGet<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/quota-activity/' + payload.path.id + '/get'
  return axios.get(api)
}

export function getRegistry () {
  const api = apiBase + '/registry'
  return axios.get(api)
}

export function getServer<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; service_id?: string; user_id?: string; vo_id?: string; 'as-admin': boolean } }) {
  const api = apiBase + '/server'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postServer<S, R> (context: ActionContext<S, R>, payload: { body: { service_id: string; image_id: string; flavor_id: string; network_id?: string; quota_id: string; remarks?: string; } }) {
  const api = apiBase + '/server'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getServerVo<S, R> (context: ActionContext<S, R>, payload: { path: { vo_id: string }, query?: { page?: number; page_size?: number; service_id?: string } }) {
  const api = apiBase + '/server/vo/' + payload.path.vo_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServerId<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, query: { 'as-admin': boolean } }) {
  const api = apiBase + '/server/' + payload.path.id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function deleteServer<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, query?: { force?: boolean } }) {
  const api = apiBase + '/server/' + payload.path.id
  const config = {
    data: payload.query
  }
  return axios.delete(api, config)
}

export function postServerAction<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, body: { action: string } }) {
  const api = apiBase + '/server/' + payload.path.id + '/action'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function postServerLock<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, query: { lock: string } }) {
  const api = apiBase + '/server/' + payload.path.id + '/lock'
  const config = {
    data: payload.query
  }
  return axios.post(api, config)
}

export function patchServerRemark<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, query: { remark: string } }) {
  const api = apiBase + '/server/' + payload.path.id + '/remark'
  const config = {
    data: payload.query
  }
  return axios.patch(api, config)
}

export function getServerStatus<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, query: { 'as-admin': string } }) {
  const api = apiBase + '/server/' + payload.path.id + '/status'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServerVnc<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/server/' + payload.path.id + '/vnc'
  return axios.get(api)
}

export function getServerArchive<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; service_id?: string } }) {
  const api = apiBase + '/server-archive'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServerArchiveVo<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; service_id?: string }, path: { vo_id: string } }) {
  const api = apiBase + '/server-archive/vo/' + payload.path.vo_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getService<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; center_id?: string; available_only?: boolean } }) {
  const api = apiBase + '/service'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServiceAdmin<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number } }) {
  const api = apiBase + '/service/admin'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServiceVo<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; center_id?: string }, path: { vo_id: string } }) {
  const api = apiBase + '/service/vo/' + payload.path.vo_id
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getServicePQuota<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/service/' + payload.path.id + '/p-quota'
  return axios.get(api)
}

export function postServicePQuota<S, R> (context: ActionContext<S, R>, payload: { body: { private_ip_total: number; public_ip_total: number; vcpu_total: number; ram_total: number; disk_size_total: number; }, path: { id: string } }) {
  const api = apiBase + '/service/' + payload.path.id + '/p-quota'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getServiceSQuota<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/service/' + payload.path.id + '/s-quota'
  return axios.get(api)
}

export function postServiceSQuota<S, R> (context: ActionContext<S, R>, payload: { body: { private_ip_total: number; public_ip_total: number; vcpu_total: number; ram_total: number; disk_size_total: number; }, path: { id: string } }) {
  const api = apiBase + '/service/' + payload.path.id + '/s-quota'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getUserAccount<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number } }) {
  const api = apiBase + '/user/account'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getVmsServicePQuota<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size: number; service_id?: string } }) {
  const api = apiBase + '/vms/service/p-quota'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getVmsServiceSQuota<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size: number; service_id?: string } }) {
  const api = apiBase + '/vms/service/s-quota'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function getVo<S, R> (context: ActionContext<S, R>, payload: { query?: { page?: number; page_size?: number; owner?: boolean; member?: boolean } }) {
  const api = apiBase + '/vo'
  const config = {
    params: payload.query
  }
  return axios.get(api, config)
}

export function postVo<S, R> (context: ActionContext<S, R>, payload: { body: { name: string; company: string; description: string } }) {
  const api = apiBase + '/vo'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function postVoMembersRole<S, R> (context: ActionContext<S, R>, payload: { path: { member_id: string; role: string } }) {
  const api = apiBase + '/vo/members/' + payload.path.member_id + '/role/' + payload.path.role
  return axios.post(api)
}

export function patchVo<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, body: { data: { name: string; company: string; description: string } } }) {
  const api = apiBase + '/vo/' + payload.path.id
  const config = {
    data: payload.body
  }
  return axios.patch(api, config)
}

export function deleteVo<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/vo/' + payload.path.id
  return axios.delete(api)
}

export function postVoAddMembers<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, body: { usernames: string[] } }) {
  const api = apiBase + '/vo/' + payload.path.id + '/add-members'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getVoListMembers<S, R> (context: ActionContext<S, R>, payload: { path: { id: string } }) {
  const api = apiBase + '/vo/' + payload.path.id + 'list-members'
  return axios.get(api)
}

export function postVoRemoveMembers<S, R> (context: ActionContext<S, R>, payload: { path: { id: string }, body: { usernames: string[] } }) {
  const api = apiBase + '/vo/' + payload.path.id + '/remove-members'
  const config = {
    data: payload.body
  }
  return axios.post(api, config)
}

export function getVpn<S, R> (context: ActionContext<S, R>, payload: { path: { service_id : string } }) {
  const api = apiBase + '/vpn/' + payload.path.service_id
  return axios.get(api)
}

export function patchVpn<S, R> (context: ActionContext<S, R>, payload: { path: { service_id: string }, body: { password: string } }) {
  const api = apiBase + '/vpn/' + payload.path.service_id
  const config = {
    data: payload.body
  }
  return axios.patch(api, config)
}

export function getVpnCa<S, R> (context: ActionContext<S, R>, payload: { path: { service_id : string } }) {
  const api = apiBase + '/vpn/' + payload.path.service_id + '/ca'
  return axios.get(api)
}

export function getVpnConfig<S, R> (context: ActionContext<S, R>, payload: { path: { service_id : string } }) {
  const api = apiBase + '/vpn/' + payload.path.service_id + '/config'
  return axios.get(api)
}
