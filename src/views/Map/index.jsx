import React, { Component } from 'react'

// 导入NavHeader组件
import NavHeader from '../../components/NavHeader'

import styles from './index.module.scss'

// 获取定位城市
import { getLocationCity } from '../../utils/city'

export default class Index extends Component {
  
  componentDidMount(){
    // 地图初始化
    this.initMap()
  }

  // 地图初始化
  initMap = async () =>  {
    // 获取城市
    let { label } = await getLocationCity()
    // 创建地图实例
    this.map = new window.BMap.Map('container')
    // 创建地址解析器实例
    this.myGeo = new window.BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    this.myGeo.getPoint(
      label,
      point => {
        if (point) {
          // 地图初始化，设置中心点同时设置地图展示级别
          this.map.centerAndZoom(point, 11)
        }
      },
      label
    )
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader name="地图找房" />
        {/* 地图 */}
        <div id="container" className={styles.container}></div>
      </div>
    )
  }
}
