import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import config from './config.json'
import 'whatwg-fetch'
import Stats from './Stats'

ReactDOM.render(
  <Stats {...config} />,
  document.getElementById('libe-labo-app-wrapper')
)

serviceWorker.unregister()
