import React, { Component } from 'react'
import moment from 'moment'
import Annotation from 'libe-components/lib/text-levels/Annotation'

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
    const vert = new Array(8).fill(0).map((v, i) => {
      const date = moment(start + (i * timespan / 7), 'x')
      return date
    })
    const horiz = new Array(6).fill(0).map((v, i) => {
      const val = i * max / 4
      return val
    })

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      <div className={`${c}-verts`}>
        {vert.map(val => {
          const disp = val.format('YYYY MMM DD HH:mm:ss')
          return <div className={`${c}-vert`}
            key={Math.random()}>
            <Annotation small>{disp}</Annotation>
          </div>
        })}
      </div>
      <div className={`${c}-horizs`}>
        {horiz.map(val => {
          return <div className={`${c}-horiz`}
            key={Math.random()}>
            <Annotation small>{val}</Annotation>
          </div>
        })}
      </div>
    </div>
  }  
}
