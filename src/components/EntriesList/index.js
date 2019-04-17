import React, { Component } from 'react'

export default class EntriesList extends Component {
  constructor () {
    super()
    this.c = 'libe-labo-stats__entries-list'
  }

  render () {
    const { c } = this
    const classes = [c]
    return <div className={classes.join(' ')}>
      EntriesList
    </div>
  }
}
