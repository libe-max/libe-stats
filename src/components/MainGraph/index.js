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
    const { data, filters, max } = props
    const { bounds: { start, end } } = filters

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      <MainGraphGrid start={start} end={end} max={max} />{
      data.map((split, i) => {
        return <MainGraphBar max={max}
          key={split.name || i}
          data={split}
          align={i < data.length / 2 ? 'left' : 'right'}
          value={split.length} />
      })
    }</div>
  }
}
