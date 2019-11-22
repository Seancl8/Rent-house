import React, { Component } from 'react'

// 导入组件
import Home from '../Home'
import HouseList from '../HouseList'
import Info from '../Info'
import My from '../My'

import { Route, Redirect, Switch } from 'react-router-dom'

import styles from './index.module.scss'
// 导入第三方组件的TabBar
import { TabBar } from 'antd-mobile'

export default class Index extends Component {
  state = {
    selectedTab: '.layout/home'
  }

  // tabs数组
  TABS = [
    {
      title: '首页',
      icon: 'icon-index',
      path: '/layout/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/layout/houselist'
    },
    {
      title: '资讯',
      icon: 'icon-info',
      path: '/layout/info'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/layout/my'
    }
  ]

  // 这种会浪费性能 多走一次render渲染
  // componentDidUpdate(prevProps) {
  //   if (prevProps.location.pathname !== this.props.location.pathname) {
  //     this.setState({
  //       selectedTab: this.props.location.pathname
  //     })
  //   }
  // }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.selectedTab !== nextProps.location.pathname) {
      return {
        selectedTab: nextProps.location.pathname
      }
    } else {
      return null
    }
  }

  render() {
    return (
      <div className={styles.layout}>
        {/* {上面是变化部分,使用嵌套路由} */}
        <Switch>
          <Route path="/layout/home" component={Home} />
          <Route path="/layout/houselist" component={HouseList} />
          <Route path="/layout/info" component={Info} />
          <Route path="/layout/my" component={My} />
          <Redirect exact from="/layout" to="/layout/home" />
        </Switch>
        {/* 下面是topbar */}
        {/* <Link to="/layout/home">首页</Link>
        <Link to="/layout/houselist">找房</Link>
        <Link to="/layout/info">咨询</Link>
        <Link to="/layout/my">我的</Link> */}
        <div className={styles.tabbar}>
          <TabBar noRenderContent>
            {this.TABS.map(item => {
              return (
                <TabBar.Item
                  title={item.title}
                  key={item.title}
                  icon={<i className={`iconfont ${item.icon}`} />}
                  selectedIcon={<i className={`iconfont ${item.icon}`} />}
                  selected={this.state.selectedTab === item.path}
                  onPress={() => {
                    // console.log(item.path);
                    // this.setState({
                    //   selectedTab: item.path
                    // })

                    // 不能连续点击当前页面
                    if (this.props.location.pathname === item.path) {
                      return
                    }
                    // 点击的时候切换路由
                    this.props.history.push(item.path)
                  }}
                ></TabBar.Item>
              )
            })}
          </TabBar>
        </div>
      </div>
    )
  }
}
