// 在js文件中要导入axios 并且通过路径 可以在拿到BASEURL后再执行
import { axios } from './axios'

// 设置本地城市
const KEY = 'hzkf_city'

// 保存到本地的方法
export const setLocalCity = city => {
  window.localStorage.setItem(KEY, JSON.stringify(city))
}

// 获取本地城市的方法
const getLocalCity = () => {
  return JSON.parse(window.localStorage.getItem(KEY))
}

// 暴露出获取定位城市的方法
export const getLocationCity = () => {
  const city = getLocalCity()
  // 如果 本地city存在的话 直接返回promise对象
  // 如果不存在通过百度地图定位api获取城市信息
  if (!city) {
    return new Promise((resolve, reject) => {
    //   console.log('本地不存在')
      const myCity = new window.BMap.LocalCity()
      myCity.get(async res => {
        const result = await axios.get('/area/info', {
            params: {
                name: res.name
            }
        })
        // 通过创建的resolve方法把结果传递出去
        resolve(result.data.body)

        // 调用方法把结果保存在本地
        setLocalCity(result.data.body)
      })
    })
  } else {
    //   Promise.resolve 适用于一定能够 返回正确值
    // console.log('本地存在');
    return Promise.resolve(city)
  }
}
