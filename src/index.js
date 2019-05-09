import { extent, min } from 'd3-array'
import { axisBottom, axisLeft } from 'd3-axis'
import { nest } from 'd3-collection'
import { easeLinear } from 'd3-ease'
import { randomUniform } from 'd3-random'
import { scaleBand, scaleLinear, scaleOrdinal, scaleSequential, scaleSqrt } from 'd3-scale'
import { interpolateViridis } from 'd3-scale-chromatic'
import { event, select, selectAll } from 'd3-selection'
import { interval } from 'd3-timer'
import 'd3-transition'
import './style.css'
import data from '../data/memex-data.csv'

let roomsData = data.filter(function(d) { return d.numrooms > 0 })
let feedData = data.filter(function(d) { return d.numfeed > 0 })
let supportData = data.filter(function(d) { return d.numsupport > 0 })

/*
ROOMS JOURNEY
*/

document.getElementById("journey-filter").addEventListener("change", function(e){
  let val = document.getElementById("journey-filter").value
  console.log(val)

  if (val == 'rooms') {
    const sessions = roomsData.map(d => d.session_uuid)
    const steps = data.map(d => d.t)
    const sessionsScaleYAxis = scaleBand().domain(sessions).range([roomsData.length * 5, 0])
    const stepsScaleXAxis = scaleBand().domain(steps).range([0, width])
    const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
    const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
    const success = ['transition', 'success']
    const successColors =  ['#000000', 'gold']


    const coloredByEventScale = scaleOrdinal()
      .domain(events)
      .range(eventColors)

    const coloredBySuccessScale = scaleOrdinal()
      .domain(success)
      .range(successColors)

    /*
    BUBBLES
    */
    d3.select("svg").remove()

    const svg = select('body')
      .append('svg')
      .attr('height', height + margins.top + margins.bottom)
      .attr('width', width + margins.left + margins.right)
      .append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`)

    const xAxis = axisBottom(stepsScaleXAxis)
    const yAxis = axisLeft(sessionsScaleYAxis)



    const circles = svg.selectAll('circle')
      .data(roomsData)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return stepsScaleXAxis(d.t) })
      .attr('cy',function (d) { return sessionsScaleYAxis(d.session_uuid) })
      .attr('r','10')
      .attr('stroke',d => coloredBySuccessScale(d.event_type))
      .attr('stroke-width',1)
      .attr('fill', d => coloredByEventScale(d.event_name))
      .on('mouseover', d => {
        const x = event.pageX
        const y = window.innerHeight - event.pageY
        makeTooltipConstructor(x, y, d)
      })
      .on('mouseout', () => {
        select('#tooltip')
        .style('opacity', 0)
      })
  } else if (val == 'support') {
    const sessions = supportData.map(d => d.session_uuid)
    const steps = data.map(d => d.t)
    const sessionsScaleYAxis = scaleBand().domain(sessions).range([supportData.length * 9, 0])
    const stepsScaleXAxis = scaleBand().domain(steps).range([0, width])
    const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
    const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
    const success = ['transition', 'success']
    const successColors =  ['#000000', 'gold']


    const coloredByEventScale = scaleOrdinal()
      .domain(events)
      .range(eventColors)

    const coloredBySuccessScale = scaleOrdinal()
      .domain(success)
      .range(successColors)


    /*
    BUBBLES
    */
    d3.select("svg").remove()

    const svg = select('body')
      .append('svg')
      .attr('height', height + margins.top + margins.bottom)
      .attr('width', width + margins.left + margins.right)
      .append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`)

    const xAxis = axisBottom(stepsScaleXAxis)
    const yAxis = axisLeft(sessionsScaleYAxis)



    const circles = svg.selectAll('circle')
      .data(supportData)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return stepsScaleXAxis(d.t) })
      .attr('cy',function (d) { return sessionsScaleYAxis(d.session_uuid) })
      .attr('r','10')
      .attr('stroke',d => coloredBySuccessScale(d.event_type))
      .attr('stroke-width',1)
      .attr('fill', d => coloredByEventScale(d.event_name))
      .on('mouseover', d => {
        const x = event.pageX
        const y = window.innerHeight - event.pageY
        makeTooltipConstructor(x, y, d)
      })
      .on('mouseout', () => {
        select('#tooltip')
        .style('opacity', 0)
      })
  } else if (val == 'feed') {
    const sessions = feedData.map(d => d.session_uuid)
    const steps = data.map(d => d.t)
    const sessionsScaleYAxis = scaleBand().domain(sessions).range([feedData.length * 6, 0])
    const stepsScaleXAxis = scaleBand().domain(steps).range([0, width])
    const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
    const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
    const success = ['transition', 'success']
    const successColors =  ['#000000', 'gold']


    const coloredByEventScale = scaleOrdinal()
      .domain(events)
      .range(eventColors)

    const coloredBySuccessScale = scaleOrdinal()
      .domain(success)
      .range(successColors)


    /*
    BUBBLES
    */
    d3.select("svg").remove()

    const svg = select('body')
      .append('svg')
      .attr('height', height + margins.top + margins.bottom)
      .attr('width', width + margins.left + margins.right)
      .append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`)

    const xAxis = axisBottom(stepsScaleXAxis)
    const yAxis = axisLeft(sessionsScaleYAxis)



    const circles = svg.selectAll('circle')
      .data(feedData)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return stepsScaleXAxis(d.t) })
      .attr('cy',function (d) { return sessionsScaleYAxis(d.session_uuid) })
      .attr('r','10')
      .attr('stroke',d => coloredBySuccessScale(d.event_type))
      .attr('stroke-width',1)
      .attr('fill', d => coloredByEventScale(d.event_name))
      .on('mouseover', d => {
        const x = event.pageX
        const y = window.innerHeight - event.pageY
        makeTooltipConstructor(x, y, d)
      })
      .on('mouseout', () => {
        select('#tooltip')
        .style('opacity', 0)
      })
  } else if (val == 'none') {
    const sessions = data.map(d => d.session_uuid)
    const steps = data.map(d => d.t)
    const sessionsScaleYAxis = scaleBand().domain(sessions).range([data.length * 5.5, 0])
    const stepsScaleXAxis = scaleBand().domain(steps).range([0, width])
    const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
    const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
    const success = ['transition', 'success']
    const successColors =  ['#000000', 'gold']


    const coloredByEventScale = scaleOrdinal()
      .domain(events)
      .range(eventColors)

    const coloredBySuccessScale = scaleOrdinal()
      .domain(success)
      .range(successColors)


    /*
    BUBBLES
    */
    d3.select("svg").remove()

    const svg = select('body')
      .append('svg')
      .attr('height', height + margins.top + margins.bottom)
      .attr('width', width + margins.left + margins.right)
      .append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`)

    const xAxis = axisBottom(stepsScaleXAxis)
    const yAxis = axisLeft(sessionsScaleYAxis)



    const circles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return stepsScaleXAxis(d.t) })
      .attr('cy',function (d) { return sessionsScaleYAxis(d.session_uuid) })
      .attr('r','10')
      .attr('stroke',d => coloredBySuccessScale(d.event_type))
      .attr('stroke-width',1)
      .attr('fill', d => coloredByEventScale(d.event_name))
      .on('mouseover', d => {
        const x = event.pageX
        const y = window.innerHeight - event.pageY
        makeTooltipConstructor(x, y, d)
      })
      .on('mouseout', () => {
        select('#tooltip')
        .style('opacity', 0)
      })
  }


});

const margins = { left: 100, top: 50, right: 50, bottom: 100 }

const fullWidth = +select('body').node().getBoundingClientRect().width
const fullHeight = +select('body').node().getBoundingClientRect().height

const height = (fullHeight * 3) - margins.top - margins.bottom
const width = (fullWidth * .85) - margins.left - margins.right


/*
SCALES
*/

const sessions = data.map(d => d.session_uuid)
const steps = data.map(d => d.t)
const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
const success = ['transition', 'success']
const successColors =  ['#000000', 'gold']

const sessionsScaleYAxis = scaleBand()
  .domain(sessions)
  .range([data.length * 5.5, 0])
const stepsScaleXAxis = scaleBand()
  .domain(steps)
  .range([0, width])

const coloredByEventScale = scaleOrdinal()
  .domain(events)
  .range(eventColors)

const coloredBySuccessScale = scaleOrdinal()
  .domain(success)
  .range(successColors)


/*
BUBBLES
*/

const svg = select('body')
  .append('svg')
  .attr('height', height + margins.top + margins.bottom)
  .attr('width', width + margins.left + margins.right)
  .append('g')
  .attr('transform', `translate(${margins.left},${margins.top})`)

const xAxis = axisBottom(stepsScaleXAxis)
const yAxis = axisLeft(sessionsScaleYAxis)



const circles = svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx',function (d) { return stepsScaleXAxis(d.t) })
  .attr('cy',function (d) { return sessionsScaleYAxis(d.session_uuid) })
  .attr('r','10')
  .attr('stroke',d => coloredBySuccessScale(d.event_type))
  .attr('stroke-width',1)
  .attr('fill', d => coloredByEventScale(d.event_name))
  .on('mouseover', d => {
    const x = event.pageX
    const y = window.innerHeight - event.pageY
    makeTooltipConstructor(x, y, d)
  })
  .on('mouseout', () => {
    select('#tooltip')
    .style('opacity', 0)
  })



/*
TOOLTIP
*/


const makeTooltipConstructor = (x, y, d) => {
  // Remove what's there
  selectAll('#tooltip *').remove()

  const tooltip = select('#tooltip')
  .style('left', `${x}px`)
  .style('bottom', `${y}px`)
  .style('opacity', 0.9)

  tooltip.append('p')
  .text(`user: ${d.user_uuid}`)

  tooltip.append('p')
  .text(`action: ${d.event_name}`)

  if (d.event_type == 'success') {
    tooltip.append('p')
    .text(`journey completed`)
  }

}
