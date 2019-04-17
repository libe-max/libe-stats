import React, { Component } from 'react'
import moment from 'moment'

import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'

import ActionsBar from './components/ActionsBar'
import MainGraph from './components/MainGraph'
import EntriesList from './components/EntriesList'

import './stats.css'
import pwd from './.pwd.js'

export default class Stats extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'libe-labo-stats'
    this.state = {
      loading: true,
      error: null,
      data: [],
      filters: {
        bounds: { start: 1, end: 2 }
      }
    }
    this.fetchData = this.fetchData.bind(this)
    this.enrichData = this.enrichData.bind(this)
    this.setFilter = this.setFilter.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * FETCH DATA
   *
   * * * * * * * * * * * * * * * */
  fetchData (
    start = moment().subtract(1, 'week').valueOf(),
    end = moment().subtract(1).valueOf()) {
    this.setState(state => ({
      loading: true,
      data: [],
      filters: {
        ...state.filters,
        bounds: { start, end }
      }
    }))
    const api = this.props.dev_api
    const body = { pwd: window.atob(pwd) }
    window.fetch(`${api}/${start}/${end}`, {
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
      const enrichedData = this.enrichData(data.data)
      this.setState({
        loading: false,
        data: enrichedData
      })
    }).catch(err => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  /* * * * * * * * * * * * * * * *
   *
   * ENRICH DATA
   *
   * * * * * * * * * * * * * * * */
  enrichData (data = []) {
    return data.map(entry => {
      const urlBits = entry.originalUrl.split('/').slice(1)
      const section = urlBits[0]
      if (section !== 'api') return null
      return {
        ...entry,
        _format: urlBits[1],
        _article: urlBits[2],
        _action: urlBits.slice(3).length ? urlBits.slice(3).join('/') : undefined
      }
    }).filter(e => e).filter(e => e.method !== 'OPTIONS')
  }

  /* * * * * * * * * * * * * * * *
   *
   * SET FILTER
   *
   * * * * * * * * * * * * * * * */
  setFilter (filter, value) {
    this.setState(state => ({
      filters: {
        ...state.filters,
        [filter]: value !== '_' ? value : null
      }
    }))
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, state } = this

    /* Assign classes */
    const classes = [c]
    if (state.error) classes.push(`${c}_error`)
    else if (state.loading) classes.push(`${c}_loading`)

    /* DOM */
    return <div className={classes.join(' ')}>
      <div className={`${c}__actions`}>
        <ActionsBar
          data={state.data}
          setFilter={this.setFilter}
          fetchData={this.fetchData} />
      </div>
      <div className={`${c}__graph`}>
        <MainGraph
          data={state.data}
          filters={state.filters} />
      </div>
      <div className={`${c}__list`}><EntriesList /></div>
      <div className={`${c}__loader`}><Loader /></div>
      <div className={`${c}__error`}><LoadingError /></div>
    </div>
  }
}
