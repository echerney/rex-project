import { axisBottom, axisLeft } from 'd3-axis'
import { scaleBand, scaleOrdinal } from 'd3-scale'
import { event, select, selectAll } from 'd3-selection'
import './style.css'
import data from '../data/memex-data.csv'

let journeyVal
let numJourneyVal
let completedVal
let margins
let fullWidth
let fullHeight
let height
let width
let filteredData

buildDropdowns()
renderData(journeyVal,numJourneyVal,completedVal)

/*
BUILD FILTERS
*/

function buildDropdowns() {
  let numJourneys = data.map(d => d.numjourneys)
  let numCompleted = data.map(d => d.numsuccess)
  let maxNumJourneys = Math.max.apply(0,numJourneys)
  let maxNumCompleted = Math.max.apply(0,numCompleted)
  let numberSelect = select('#num-journey-filter')
  let completedSelect = select('#completed-filter')
  for (let i=0;i<maxNumJourneys;i++) {
    numberSelect.append('option')
    .text(i+1)
  }
  for (let i=0;i<=maxNumCompleted;i++) {
    completedSelect.append('option')
    .text(i)
  }
}

/*
EVENT LISTENERS
*/

document.getElementById("journey-filter").addEventListener("change", function(e){
  let journeyVal = document.getElementById("journey-filter").value
  let numJourneyVal = document.getElementById("num-journey-filter").value
  let completedVal = document.getElementById("completed-filter").value
  renderData(journeyVal,numJourneyVal,completedVal)
})

document.getElementById("num-journey-filter").addEventListener("change", function(e){
  let journeyVal = document.getElementById("journey-filter").value
  let numJourneyVal = document.getElementById("num-journey-filter").value
  let completedVal = document.getElementById("completed-filter").value
  renderData(journeyVal,numJourneyVal,completedVal)
})

document.getElementById("completed-filter").addEventListener("change", function(e){
  let journeyVal = document.getElementById("journey-filter").value
  let numJourneyVal = document.getElementById("num-journey-filter").value
  let completedVal = document.getElementById("completed-filter").value
  renderData(journeyVal,numJourneyVal,completedVal)
})

function renderData(journeyVal,numJourneyVal,completedVal){

  //FILTERING DATA BY JOURNEY
  let stepOneData = data
  if (journeyVal) {
    let filterByJourney = function (journeyVal){
      if (journeyVal == 'rooms') {
        stepOneData = data.filter(function(d) { return d.numrooms > 0 })
      } else if (journeyVal == 'feed') {
        stepOneData = data.filter(function(d) { return d.numfeed > 0 })
      } else if (journeyVal == 'support') {
        stepOneData = data.filter(function(d) { return d.numsupport > 0 })
      } else {
        stepOneData = data
      }
    }
    filterByJourney(journeyVal)
  }
  let stepTwoData = stepOneData
  //FILTERING DATA BY NUMBER OF JOURNEYS
  if (numJourneyVal) {
    let filterByNumJourneys = function(numJourneyVal) {
      stepTwoData = stepOneData.filter(function(d) { return d.numjourneys >= numJourneyVal })
    }
    filterByNumJourneys(numJourneyVal)
  }
  let stepThreeData = stepTwoData
  //FILTERING DATA BY NUMBER OF JOURNEYS THAT ACHIEVED SUCCESS
  console.log(completedVal)
  if (completedVal) {
    let filterByCompleted = function(completedVal) {
      stepThreeData = stepTwoData.filter(function(d) { return d.numsuccess >= completedVal })
    }
    filterByCompleted(completedVal)
  }
  filteredData = stepThreeData



  // VARIABLES FOR SCALES

  const sessions = filteredData.map(d => d.session_uuid)
  const steps = filteredData.map(d => d.t)
  const events = ['app_home', 'rooms_home', 'rooms_scroll', 'rooms_detail', 'rooms_reservation', 'feed_home', 'feed_scroll', 'feed_interact', 'support_home', 'support_detail', 'support_submit']
  const eventColors = ['#ffffff', '#e8f4f7', '#a3d4e2', '#5eb4cd', '#0d4a5c', '#f7ebe8', '#e2b1a3', '#bf5130', '#e8f7eb', '#a3e2b1', '#0d5c1f']
  const success = ['transition', 'success']
  const successColors =  ['#000000', 'gold']

  // CANVAS SIZE

  margins = { left: 100, top: 50, right: 50, bottom: 100 }
  fullWidth = +select('body').node().getBoundingClientRect().width
  fullHeight = +select('body').node().getBoundingClientRect().height
  width = fullWidth * .7
  if (filteredData.length < 40) {
    height = filteredData.length * 9
  } else {
    height = filteredData.length * 5.5
  }

    // BUILD SCALES

  const sessionsScaleYAxis = scaleBand()
    .domain(sessions)
    .range([height, 0])
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
      .data(filteredData)
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

margins = { left: 100, top: 50, right: 50, bottom: 100 }
fullWidth = +select('body').node().getBoundingClientRect().width
fullHeight = +select('body').node().getBoundingClientRect().height
height = 500
width = 400



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
