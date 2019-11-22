import {Component} from 'react'
import axios from 'axios'

// 导入基准路径
import {BASEURL} from './url'

// 设置基准路径
axios.defaults.baseURL = BASEURL

// 把axios挂载到组件的原型上
Component.prototype.$http = axios

// 导出设置了基准路径的axios
export {axios}