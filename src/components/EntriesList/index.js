import React, { Component } from 'react'
import moment from 'moment'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class EntriesList extends Component {
  constructor () {
    super()
    this.c = 'libe-labo-stats__entries-list'
    this.state = { page: 0 }
    this.loadMore = this.loadMore.bind(this)
  }

  loadMore () {
    this.setState(state => ({
      page: state.page + 1
    }))
  }

  render () {
    const { c, props, state } = this
    const { data } = props

    /* Inner logic */
    const entriesPerPage = 300
    const limit = entriesPerPage * (state.page + 1)
    const sortedData = [...data].sort((a, b) => {
      return a.timestamp - b.timestamp
    }).filter((e, i) => i < limit)

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>{
      sortedData.map(entry => {
        return <div className={`${c}-line`}>
          <div className={`${c}-item time`}><Annotation>{moment(entry.timestamp, 'x').format('dd D MMM YY — HH:mm:ss')}</Annotation></div>
          <div className={`${c}-item method`}><Annotation>{entry.method}</Annotation></div>
          <div className={`${c}-item url`}><Annotation>{entry.originalUrl}</Annotation></div>
          <div className={`${c}-item ip`}><Annotation>{entry.ip}</Annotation></div>
        </div>
      })
    }{
      (state.page + 1) * entriesPerPage < data.length
        ? <button className={`${c}-load-more`}
          onClick={this.loadMore}>Charger plus</button>
        : ''
    }</div>
  }
}
