import request from '@/utils/request'

const districtApi = {
  DistrictList: 'web/districts',
}

export const getDistrictList = () => {
  return request({
    url: districtApi.DistrictList,
    method: 'get'
  })
}
