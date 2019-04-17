import React, { Component } from 'react'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class MainGraphBar extends Component {
  constructor () {
    super()
    this.c = 'libe-labo-stats__main-graph-bar'
  }

  render () {
    const { c, props } = this
    const { value, max } = props

    /* Inner logic */
    const style = { height: `${(value / max) * 80}%` }

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      <div className={`${c}-value`} style={style} />
      <div className={`${c}-content`}>
        <Annotation>{value}&nbsp;visites</Annotation>
      </div>
    </div>
  }
}
