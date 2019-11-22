import React, { Component } from 'react'

// /导入样式
import styles from './index.module.scss'

// 导入获取定位城市的方法
import { getLocationCity, setLocalCity } from '../../utils/city'

// 导入nav组件
import NavHeader from '../../components/NavHeader'

// 导入列表优化组件
import { AutoSizer, List } from 'react-virtualized'

// 导入toast组件
import { Toast } from 'antd-mobile'

// 设置list组件高度常量
// 每一行标题的高度
const TITLE_HEIGHT = 36
// 每一行中下面的每个城市的高度
const ROW_HEIGHT = 50

// 设置有房源信息的城市
const CITIES = ['北京', '上海', '广州', '深圳']

export default class Index extends Component {
  state = {
    // 左边城市对象
    cityObj: null,
    // 右边城市索引数据
    cityIndexList: null,
    // 右边索引默认值
    actived: 0
  }

  listRef = React.createRef()

  componentDidMount() {
    // 获取城市列表数据
    this.getCityList()
  }

  getCityList = async () => {
    let res = await this.$http.get('/area/city?level=1')
    let tempObj = {} //临时对象
    res.data.body.forEach(item => {
      // 截取每个城市对象的首字母
      let firstLetter = item.short.substring(0, 1)
      // 判断字母属性是否有数据,如果有直接把对象push进去
      if (tempObj[firstLetter]) {
        tempObj[firstLetter].push(item)
      } else {
        tempObj[firstLetter] = [item]
      }
    })

    // 处理右边的城市索引列表数据
    const cityIndexList = Object.keys(tempObj).sort()

    // 获取热门城市数据
    let hotCityList = await this.$http.get('/area/hot')
    // 在字母属性数组里面加上热门城市对应的属性hot
    cityIndexList.unshift('hot')
    // 在临时对象里给hot属性赋值
    tempObj['hot'] = hotCityList.data.body

    // 获取定位城市
    let locationCity = await getLocationCity()
    // console.log(locationCity)
    cityIndexList.unshift('#')
    tempObj['#'] = [locationCity]
    // console.log(tempObj)
    this.setState({
      cityObj: tempObj,
      cityIndexList
    })
  }

  // 对左边的城市进行格式处理
  formatLetter = key => {
    switch (key) {
      case '#':
        return '定位城市'
      case 'hot':
        return '热门城市'
      default:
        return key.toUpperCase()
    }
  }

  // 渲染行的方法
  rowRenderer = ({ key, index, style }) => {
    // 获取索引中的每一个属性值字母
    let letter = this.state.cityIndexList[index]
    // 获取字母对应的城市数组
    let cityList = this.state.cityObj[letter]
    return (
      <div key={key} style={style} className={styles.city}>
        {/* 渲染每一行的标题 */}
        <div className={styles.title}>{this.formatLetter(letter)}</div>
        {/* 渲染每一行的城市 */}
        {cityList.map(item => {
          return (
            <div
              className={styles.name}
              key={item.value}
              onClick={() => this.toggleCity(item)}
            >
              {item.label}
            </div>
          )
        })}
      </div>
    )
  }

  // 切换城市选择
  toggleCity = ({ label, value }) => {
    // 判断是否包含有房源信息的城市
    if (!CITIES.includes(label)) {
      // 不包含就提示
      Toast.info('该城市暂无房源信息', 1)
      return
    }

    // 修改城市
    setLocalCity({ label, value })

    // 包含的话就返回上一级并且修改城市
    this.props.history.goBack()
  }

  // 计算行高的方法
  // { height: number} TS写法 代表数字类型
  calRowHeight = ({ index }) => {
    // 获取字母属性
    let letter = this.state.cityIndexList[index]
    // 获取属性对应的城市数组
    let cityList = this.state.cityObj[letter]
    return TITLE_HEIGHT + ROW_HEIGHT * cityList.length
  }

  // 点击右边下标切换索引的方法
  clickIndex = index => {
    // 修改激活的默认下标
    this.listRef.current.scrollToRow(index)
  }

  // 渲染右边城市索引的方法
  renderCityIndex = () => {
    let { cityIndexList, actived } = this.state
    return (
      <div className={styles.cityIndex}>
        {cityIndexList.map((item, index) => {
          return (
            <div
              className={styles.cityIndexItem}
              key={index}
              onClick={() => this.clickIndex(index)}
            >
              <span className={index === actived ? styles.indexActive : ''}>
                {item === 'hot' ? '热' : item.toUpperCase()}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  // 左边滚动的时候触发
  onRowsRendered = ({ startIndex }) => {
    // 进行判断
    if (this.state.actived !== startIndex) {
      // 修改右边的激活状态下标
      this.setState({
        actived: startIndex
      })
    }
  }

  render() {
    return (
      <div className={styles.citylist}>
        {/* 渲染头部nav */}
        <NavHeader name="城市选择" />
        {/* 数据存在就渲染城市列表 */}
        {this.state.cityObj && (
          <AutoSizer>
            {(
              { height, width } //如果没有高度就不会渲染
            ) => (
              <List
                ref={this.listRef}
                scrollToAlignment="start"
                height={height}
                rowCount={this.state.cityIndexList.length}
                rowHeight={this.calRowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                width={width}
              />
            )}
          </AutoSizer>
        )}
        {/* 渲染右边的索引 */}
        {this.state.cityIndexList && this.renderCityIndex()}
      </div>
    )
  }
}
