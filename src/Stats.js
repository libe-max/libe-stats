import React, { Component } from 'react'
import moment from 'moment'
import 'moment/locale/fr'

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
      if (entry.originalUrl === '/api/game-of-thrones') {
        entry.originalUrl = '/api/game-of-thrones/game-of-thrones/load'
      } else if (entry.originalUrl === '/api/game-of-thrones/submit') {
        entry.originalUrl = '/api/game-of-thrones/game-of-thrones/submit'
      }
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
    const { data, filters } = state

    /* Inner logic */
    const start = filters.bounds.start
    const end = filters.bounds.end
    const timespan = end - start
    let splitsLength = 0
    const d = moment.duration
    if (timespan < d(3, 'days')) splitsLength = d(15, 'minutes').valueOf()
    else if (timespan < d(2, 'weeks')) splitsLength = d(1, 'hour').valueOf()
    else if (timespan < d(2, 'months')) splitsLength = d(6, 'hours').valueOf()
    else if (timespan < d(8, 'months')) splitsLength = d(12, 'hours').valueOf()
    else if (timespan < d(5, 'years')) splitsLength = d(1, 'week').valueOf()
    else splitsLength = d(1, 'month').valueOf()
    const nbOfSplits = Math.floor(timespan / splitsLength) + 1
    const splits = new Array(nbOfSplits).fill(0).map((v, i) => {
      const result = []
      result.name = ''
      result.duration = splitsLength
      result.bounds = {
        start: start + i * splitsLength,
        end: start + (i + 1) * splitsLength
      }
      return result
    })
    data.forEach(entry => {
      const timeFromStart = entry.timestamp - start
      const splitNb = Math.floor(timeFromStart / splitsLength)
      if (splitNb < splits.length) {
        splits[splitNb].push(entry)
        if (!splits[splitNb].name) splits[splitNb].name = ''
        splits[splitNb].name += entry._id
      }
    })
    const max = Math.max(...splits.map(split => split.length))
    const filteredData = data.map(entry => {
      if (entry.timestamp < filters.bounds.start) return
      if (entry.timestamp > filters.bounds.end) return
      if (filters.ip && entry.ip !== filters.ip) return
      if (filters.action && entry._action !== filters.action) return
      if (filters.article && entry._article !== filters.article) return
      if (filters.format && entry._format !== filters.format) return
      return entry
    }).filter(e => e)
    const filteredSplits = new Array(nbOfSplits).fill(0).map((v, i) => {
      const result = []
      result.name = ''
      result.duration = splitsLength
      result.bounds = {
        start: start + i * splitsLength,
        end: start + (i + 1) * splitsLength
      }
      return result
    })
    filteredData.forEach(entry => {
      const timeFromStart = entry.timestamp - start
      const splitNb = Math.floor(timeFromStart / splitsLength)
      if (splitNb < filteredSplits.length) {
        filteredSplits[splitNb].push(entry)
        if (!filteredSplits[splitNb].name) filteredSplits[splitNb].name = ''
        filteredSplits[splitNb].name += entry._id
      }
    })
    const filteredMax = Math.max(...filteredSplits.map(split => split.length))

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
          data={filteredSplits}
          max={max}
          filters={state.filters} />
      </div>
      <div className={`${c}__list`}>
        <EntriesList
          data={filteredData} />
      </div>
      <div className={`${c}__loader`}><Loader /></div>
      <div className={`${c}__error`}><LoadingError /></div>
    </div>
  }
}
