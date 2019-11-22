import React from 'react'

import { withRouter } from 'react-router-dom'

import { NavBar } from 'antd-mobile'

import styles from './index.module.scss'

import propTypes from "prop-types";

function NavHeader({ name, history }) {
  return (
    <NavBar
      className={styles.navBar}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.goBack()}
    >
      {name}
    </NavBar>
  )
}

// 类型约束
NavHeader.propTypes = {
  name: propTypes.string.isRequired
}

export default withRouter(NavHeader)
