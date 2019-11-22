import React, { Component } from 'react'

// 导入轮播图的组件
import { Carousel, Flex, Grid } from 'antd-mobile'

// 导入封装的axios的url
import { BASEURL } from '../../utils/url'

// 导入样式
import styles from './index.module.scss'

// 导入路由
import { Link } from 'react-router-dom'

// 导入组件
import SearchHeader from "../../components/SearchHeader";

// 导入获取定位城市的方法
import { getLocationCity } from "../../utils/city";

// 导入图片
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

export default class Index extends Component {
  state = {
    // 轮播数据
    swipper: null,
    imgHeight: 200,
    // 租房数据
    groupsData: null,
    // 最新咨询数据
    latestNews: null,
    // 默认城市值
    city: '北京'
  }

  navs = [
    { icon: image1, text: '整租', path: '/layout/houselist' },
    { icon: image2, text: '合租', path: '/layout/houselist' },
    { icon: image3, text: '地图找房', path: '/map' },
    { icon: image4, text: '去出租', path: '/rent/add' }
  ]

  async componentDidMount() {
    const {label, value} = await getLocationCity()
    this.setState({
      city: label
    })

    // 获取轮播数据
    this.getSwipperData()

    // 获取租房小组数据
    this.getGroupsData(value)

    // 获取最新咨询的数据
    this.getLatestNews(value)
  }

  // 获取swipper数据
  getSwipperData = async () => {
    let res = await this.$http.get('/home/swiper')
    // 把值赋予给data
    setTimeout(() => {
      this.setState({
        swipper: res.data.body
      })
    }, 100)
  }

  // 获取租房小组数据
  getGroupsData = async (value) => {
    let res = await this.$http.get(
      `/home/groups?area=${value}`
    )
    this.setState({
      groupsData: res.data.body
    })
  }

  // 获取最新咨询的数据
  getLatestNews = async (value) => {
    let res = await this.$http.get(`/home/news?area=${value}`)
    this.setState({
      latestNews: res.data.body
    })
  }

  // 渲染swipper区域
  renderSwipper = () => {
    return (
      <Carousel
        autoplay
        autoplayInterval={1000}
        infinite
        className={styles.swiper}
      >
        {this.state.swipper.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`${BASEURL}${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                // 刷新的时候自动调整高度
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染nav区域
  renderNav = () => {
    return (
      <Flex className={styles.nav}>
        {this.navs.map(item => {
          return (
            <Flex.Item key={item.text}>
              <Link to={item.path}>
                <img src={item.icon} alt="" />
                <p>{item.text}</p>
              </Link>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  // 渲染租房小组区域
  renderGroups = () => {
    return (
      <div className={styles.groups}>
        <Flex>
          <Flex.Item className={styles.title}>
            <span>租房小组</span>
          </Flex.Item>
          <Flex.Item align="end">
            <span>更多</span>
          </Flex.Item>
        </Flex>
        {/* 宫格 */}
        <Grid
          data={this.state.groupsData}
          columnNum={2}
          square={false}
          hasLine={false}
          renderItem={dataItem => (
            <div className={styles.navItem} key={dataItem.id}>
              <div className={styles.left}>
                <p>{dataItem.title}</p>
                <p>{dataItem.desc}</p>
              </div>
              <div className={styles.right}>
                <img src={`${BASEURL}${dataItem.imgSrc}`} alt="" />
              </div>
            </div>
          )}
        />
      </div>
    )
  }

  // 渲染咨询区域
  renderNews = () => {
    return (
      <div className={styles.news}>
        <h3 className={styles.groupTitle}>最新咨询</h3>
        {this.state.latestNews.map(item => {
          return (
            <div className={styles.newsItem} key={item.id}>
              <div className={styles.imgWrap}>
                <img className={styles.img} src={`${BASEURL}${item.imgSrc}`} alt="" />
              </div>
              <Flex className={styles.content} direction="column" justify="between">
                <h3 className={styles.title}>{item.title}</h3>
                <Flex className={styles.info} justify='between'>
                  <span>{item.from}</span>
                  <span>{item.date}</span>
                </Flex>
              </Flex>
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 搜索 */}
        <SearchHeader city={this.state.city} />
        {/* 轮播区域 */}
        {this.state.swipper && this.renderSwipper()}
        {/* nav区域 */}
        {this.renderNav()}
        {/* 租房小组 */}
        {this.state.groupsData && this.renderGroups()}
        {/* 渲染咨询 */}
        {this.state.latestNews && this.renderNews()}
      </div>
    )
  }
}
