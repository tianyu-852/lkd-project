import storage from 'store'
import {getDistrictList} from "@/api/district"

const district = {
  state: {
    districts: [],
  },

  mutations: {
    setDistricts(districts) {
      this.districts = districts
    },

    getProvinces() {
      return this.districts.map(district => {
        return {
          "name": district.name,
          "district_id": district.district_id,
        }
      })
    },

    getCity(districtId) {
      return this.districts
        .find(district => district.district_id === districtId)
        .cities || []
    },
  },

  actions: {
    getDistrictList({commit, state}) {
      return new Promise((resolve) => {
        getDistrictList().then(({data}) => {
          commit('setDistricts', data)
          resolve(data)
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    }
  }
}

export default district
