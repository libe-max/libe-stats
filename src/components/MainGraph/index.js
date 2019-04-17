import React, { Component } from 'react'
import moment from 'moment'
import MainGraphGrid from '../MainGraphGrid'
import MainGraphBar from '../MainGraphBar'

export default class MainGraph extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'libe-labo-stats__main-graph'
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props } = this
    const { data, filters } = props

    /* Inner logic */
    const start = filters.bounds.start
    const end = filters.bounds.end
    const timespan = end - start
    let splitsLength = 0
    if (timespan < 600 * 1000) splitsLength = 1000 // Less than 10 minute —> 1 sec split
    else if (timespan < 4 * 60 * 60 * 1000) splitsLength = 60 * 1000 // Less than 4 hours —> 1 min split
    else if (timespan < 8 * 24 * 60 * 60 * 1000) splitsLength = 15 * 60 * 1000 // Less than 8 days -> 15 min split
    else if (timespan < 32 * 24 * 60 * 60 * 1000) splitsLength = 60 * 60 * 1000 // Less than 1 month —> 1h split
    else if (timespan < 367 * 24 * 60 * 60 * 1000) splitsLength = 12 * 60 * 60 * 1000 // Less than 1 year —> 12h split
    else if (timespan < 10 * 366 * 24 * 60 * 60 * 1000) splitsLength = 7 * 24 * 60 * 1000 // Less than 10 years —> 1 week split
    else splitsLength = 31 * 24 * 60 * 1000 // More than 10 years —> 1 month split
    const nbOfSplits = Math.floor(timespan / splitsLength) + 1
    const splits = new Array(nbOfSplits).fill(0).map(v => [])
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

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      <MainGraphGrid start={start} end={end} max={max} />{
      splits.map((split, i) => {
        return <MainGraphBar
          key={split.name || i}
          data={split}
          max={max}
          value={split.length} />
      })
    }</div>
  }
}
