import React, { Component } from 'react'
import moment from 'moment'
import pwd from './.pwd.js'

export default class Stats extends Component {
  constructor (props) {
    super(props)
    this.c = 'libe-labo-stats'
    this.state = {
      loading: true,
      error: null,
      data: []
    }
    this.fetchData = this.fetchData.bind(this)
    this.fetchData()
  }

  fetchData () {
    const api = this.props.dev_api
    const now = moment().valueOf()
    const oneWeekAgo = moment().subtract(1, 'week').valueOf()
    const body = { pwd: window.atob(pwd) }
    window.fetch(`${api}/${oneWeekAgo}/${now}`, {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.ok) return res.json()
      else throw new Error(`fetchData – Error ${res.status}: ${res.statusText}`)
    }).then(data => {
      if (data.err) throw new Error(`fetchData – Error: ${data.err}`)
      this.setState({
        loading: false,
        data: data.data
      })
    }).catch(err => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  render () {
    const { c, props, state } = this

    const classes = [c]
    if (state.error) classes.push(`${c}__error`)
    else if (state.loading) classes.push(`${c}__loading`)

    return <div className={classes.join(' ')}>
      <div className={`${c}__actions`}>Actions</div>
      <div className={`${c}__graph`}>Graph</div>
      <div className={`${c}__list`}>List</div>
    </div>
  }
}
