import React, { Component } from 'react'
import moment from 'moment'
import Annotation from 'libe-components/lib/text-levels/Annotation'

export default class MainGraphBar extends Component {
  constructor () {
    super()
    this.c = 'libe-labo-stats__main-graph-bar'
  }

  render () {
    const { c, props } = this
    const { value, max, data, align } = props

    /* Inner logic */
    const style = { height: `${(value / max) * 80}%` }
    const startDate = moment(data.bounds.start, 'x').format(`D MMM YY HH[h]mm`)
    const endDate = moment(data.bounds.end, 'x').format(`D MMM YY HH[h]mm`)
    const hourlyRate = Math.floor(value * moment.duration(1, 'hour') / data.duration * 100) / 100

    /* Assign classes */
    const classes = [c]
    if (align === 'right') classes.push(`${c}_right-align-tooltip`)

    /* DOM */
    return <div className={classes.join(' ')}>
      <div className={`${c}-value`} style={style} />
      <div className={`${c}-tooltip`}>
        <Annotation>{value}&nbsp;visites</Annotation>
        <Annotation>({hourlyRate}&nbsp;par&nbsp;heure)</Annotation>
        <Annotation small>{startDate}</Annotation>
        <Annotation small>{endDate}</Annotation>
      </div>
    </div>
  }
}
