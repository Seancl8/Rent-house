import React from 'react'

// 导入类型控制
import propTypes from 'prop-types'

// 导入样式
import styles from './index.module.scss'

// 导入flex
import { Flex } from 'antd-mobile'

// 导入高阶组件
import { withRouter } from 'react-router-dom'

function SearchHeader({ city, history }) {
  return (
    <Flex className={styles.root}>
      <Flex className={styles.searchLeft} onClick={() => history.push('/citylist')}>
        <div className={styles.location}>
          <span>{city}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className={styles.searchForm}>
          <i className="iconfont icon-search"></i>
          <span>请输入小区或是地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

SearchHeader.propTypes = {
  city: propTypes.string.isRequired
}

export default withRouter(SearchHeader)
