import React, { Component } from 'react'
import moment from 'moment'

export default class MainGraphGrid extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'libe-labo-stats__main-graph-grid'
  }

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props } = this
    const { start, end, max } = props

    /* Inner logic */
    const timespan = end - start
    new Array(7).fill(0).map((v, i) => {
      const date = moment(start + (i * timespan / 11), 'x')
      // console.log(date.format('DD-MM-YYYY HH:mm:ss'))
    })

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      GRID !
    </div>
  }  
}
