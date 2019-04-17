import React, { Component } from 'react'
import moment from 'moment'

export default class ActionsBar extends Component {
  /* * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'libe-labo-stats__actions-bar'
    this.fetchViaInputs = this.fetchViaInputs.bind(this)
    this.goToday = this.goToday.bind(this)
    this.goToPrevTime = this.goToPrevTime.bind(this)
    this.goToNextTime = this.goToNextTime.bind(this)
    this.filterOnFormat = this.filterOnFormat.bind(this)
    this.filterOnArticle = this.filterOnArticle.bind(this)
    this.filterOnAction = this.filterOnAction.bind(this)
    this.filterOnIp  = this.filterOnIp.bind(this)
  }

  /* * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.fetchViaInputs()
  }

  /* * * * * * * * * * * * * * * *
   *
   * FETCH VIA INPUTS
   *
   * * * * * * * * * * * * * * * */
  fetchViaInputs () {
    const start = moment(this.startDateInput.value, 'YYYY-MM-DD').startOf('day')
    const end = moment(this.endDateInput.value, 'YYYY-MM-DD').endOf('day')
    this.props.fetchData(start.valueOf(), end.valueOf())
  }

  /* * * * * * * * * * * * * * * *
   *
   * GO TODAY
   *
   * * * * * * * * * * * * * * * */
  goToday () {
    const currentStart = moment(this.startDateInput.value, 'YYYY-MM-DD').startOf('day')
    const currentEnd = moment(this.endDateInput.value, 'YYYY-MM-DD').startOf('day')
    const duration = currentEnd - currentStart
    const daysDuration = moment.duration(duration).days()
    const end = moment().startOf('day')
    const start = moment().startOf('day').subtract(daysDuration, 'days')
    this.startDateInput.value = start.format('YYYY-MM-DD')
    this.endDateInput.value = end.format('YYYY-MM-DD')
    this.fetchViaInputs()
  }

  /* * * * * * * * * * * * * * * *
   *
   * GO TO PREV TIME
   *
   * * * * * * * * * * * * * * * */
  goToPrevTime () {
    const currentStart = moment(this.startDateInput.value, 'YYYY-MM-DD').startOf('day')
    const currentEnd = moment(this.endDateInput.value, 'YYYY-MM-DD').startOf('day')
    const duration = currentEnd - currentStart
    const daysDuration = moment.duration(duration).days()
    const start = currentStart.subtract(daysDuration + 1, 'days')
    const end = currentEnd.subtract(daysDuration + 1, 'days')
    this.startDateInput.value = start.format('YYYY-MM-DD')
    this.endDateInput.value = end.format('YYYY-MM-DD')
    this.fetchViaInputs()
  }

  /* * * * * * * * * * * * * * * *
   *
   * GO TO NEXT TIME
   *
   * * * * * * * * * * * * * * * */
  goToNextTime () {
    const currentStart = moment(this.startDateInput.value, 'YYYY-MM-DD').startOf('day')
    const currentEnd = moment(this.endDateInput.value, 'YYYY-MM-DD').startOf('day')
    const duration = currentEnd - currentStart
    const daysDuration = moment.duration(duration).days() 
    const start = currentStart.add(daysDuration + 1, 'days')
    const end = currentEnd.add(daysDuration + 1, 'days')
    this.startDateInput.value = start.format('YYYY-MM-DD')
    this.endDateInput.value = end.format('YYYY-MM-DD')
    this.fetchViaInputs()
  }

  /* * * * * * * * * * * * * * * *
   *
   * SET FILTERS
   *
   * * * * * * * * * * * * * * * */
  filterOnFormat = e => this.setFilter('format', e.target.value)
  filterOnArticle = e => this.setFilter('article', e.target.value)
  filterOnAction = e => this.setFilter('action', e.target.value)
  filterOnIp = e => this.setFilter('ip', e.target.value)
  setFilter = (filter, value) => this.props.setFilter(filter, value)

  /* * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * */
  render () {
    const { c, props } = this
    const { data } = props

    /* Inner logic */
    const uniqFormats = [...new Set(data.map(entry => entry._format))].filter(e => e)
    const uniqArticles = [...new Set(data.map(entry => entry._article))].filter(e => e)
    const uniqActions = [...new Set(data.map(entry => entry._action))].filter(e => e)
    const uniqIps = [...new Set(data.map(entry => entry.ip))].filter(e => e)

    /* Assign classes */
    const classes = [c]

    /* DOM */
    return <div className={classes.join(' ')}>
      <div className={`${c}__time`}>
        <button onClick={this.goToPrevTime}>‹—</button>
        <input type='date'
          ref={n => { this.startDateInput = n }}
          onBlur={this.fetchViaInputs}
          defaultValue={moment().startOf('day').subtract(6, 'days').format('YYYY-MM-DD')} />
        <input type='date'
          ref={n => { this.endDateInput = n }}
          onBlur={this.fetchViaInputs}
          defaultValue={moment().endOf('day').format('YYYY-MM-DD')} />
        <button onClick={this.goToNextTime}>—›</button>
        <button onClick={this.goToday}>Aujourd'hui</button>
      </div>

      <div className={`${c}__format`}>
        <select defaultValue='_'
          onChange={this.filterOnFormat}>
          <option value='_'>Tous les formats</option>
          {uniqFormats.map(format => {
            return <option key={format}
              value={format}>
              {format}
            </option>
          })}
        </select>
      </div>

      <div className={`${c}__article`}>
        <select defaultValue='_'
          onChange={this.filterOnArticle}>
          <option value='_'>Tous les articles</option>
          {uniqArticles.map(article => {
            return <option key={article}
              value={article}>
              {article}
            </option>
          })}
        </select>
      </div>

      <div className={`${c}__actions`}>
        <select defaultValue='_'
          onChange={this.filterOnAction}>
          <option value='_'>Toutes les actions</option>
          {uniqActions.map(action => {
            return <option key={action}
              value={action}>
              {action}
            </option>
          })}
        </select>
      </div>

      <div className={`${c}__ip-addresses`}>
        <select defaultValue='_'
          onChange={this.filterOnIp}>
          <option value='_'>Toutes les IP</option>
          {uniqIps.map(ip => {
            return <option key={ip}
              value={ip}>
              {ip}
            </option>
          })}
        </select>
      </div>
    </div>
  }
}
