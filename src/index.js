import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

// 导入字体文件
import './assets/fonts/iconfont.css'

// 导入列表优化组件样式
import 'react-virtualized/styles.css'

// 最后导入我们自己的样式文件
import './index.css'

// 导入axios，这里并不需要些 import xxx from '路径'
// 因为我们整个地方只是为了让 webpack 去执行 axios 中的代码，并不是为了得到它的东西
import './utils/axios'

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
