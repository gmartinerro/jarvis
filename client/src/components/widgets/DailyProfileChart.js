import React, { Component } from 'react';
import * as d3 from 'd3';
import './DailyProfileChart.scss'
import { connect } from 'react-redux';
import {getDailyProfile} from '../../actions';


class DailyProfileChart extends Component {
  margin={left:50,right:20,top:20,bottom:30};
  
  componentDidMount() {
    this.svgWidth = this.props.width ||  this.divElement.parentElement.clientWidth;
    this.svgHeight = this.props.height || this.divElement.parentElement.clientHeight; 
  }

  componentDidUpdate() {
    console.log("UPDATE DP", this.props)
    this.updateChart();
  }

  makeCurveFunctions() {
    this.chartWidth = this.svgWidth - this.margin.left - this.margin.right;
    this.chartHeight = this.svgHeight - this.margin.bottom - this.margin.top;

    this.scaleY = d3.scaleLinear()
                    .range([this.chartHeight,0]);

    this.scaleX = d3.scaleLinear()
                    .domain([0,23])
                    .range([0, this.chartWidth]);
    
    this.xAxis = d3.axisBottom(this.scaleX)
                   .ticks(24);                 

    this.yAxis = d3.axisLeft(this.scaleY)
                   .ticks(5);

    // Create data line with real data
    this.medianLine = d3.area()
                        .x((d,i) => this.scaleX(i))
                        .y(d => this.scaleY(d))
                        .curve(d3.curveMonotoneX);
  }


  drawChart() {

    if (this.props.dailyProfile == null)
      return;

    this.makeCurveFunctions();

    const svg = d3
      .select('#' + this.props.id)
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    svg.append('g').attr('transform',`translate(${this.margin.left},${this.margin.top})`).attr('class', 'y axis').call(this.yAxis)
    svg.append('g').attr('transform',`translate(${this.margin.left},${this.svgHeight-this.margin.bottom})`).attr('class', 'x axis').call(this.xAxis)

    svg.append('clipPath')
        .attr('id', 'rect-clip'+this.props.id)
        .append('rect')
        .attr('width', this.chartWidth + 2)
        .attr('height', this.chartHeight + 10) //Because of the y offset to the top
        .attr('y', -10)
        .attr('x', 0)

    svg.append('g').attr('class','path').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    svg.append('g').attr('class','markers').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    let initData = [];
    
    for (let i in this.props.dailyProfile.tickets){
       initData[i] = 0;
    }

    let path = svg.select('g.path')
      .selectAll('.median-line')
      .data([initData]);

    path.enter()
        .append('path')
        .attr('class', 'median-line')
        .attr('d', this.medianLine)
        .attr('clip-path', 'url(#rect-clip'+this.props.id+')')

    svg.select('g.markers')
      .selectAll(".point")
      .data(initData)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("index",(d, i)=> i)
      .attr("cx", (d,i) => this.scaleX(i))
      .attr("cy", d => this.scaleY(d))
      .attr("r", d=>3)
      .on('mouseover',(d)=>this.handleMouseOver(d))


    this.svg = svg;
  }


  updateChart() {
        
    if (this.props.dailyProfile == null)
      return;

    if (!this.svg)
      this.drawChart();

    // if (this.stateSignature === this.state.signature)
    //    return;
      
    // this.stateSignature = this.state.signature;
    this.dates = this.props.dates;

    let maxData = d3.max(this.props.dailyProfile,(d)=>d) || 1000;    
    maxData = 30;
    this.scaleY.domain([0, maxData]);

    this.svg.select('.y.axis').transition().duration(40).call(this.yAxis);
    setTimeout(()=>this.updateRealPath(),0);
  }

  updateRealPath(){
    let path = this.svg.select('g.path')
                  .selectAll('.median-line')
                  .data([this.props.dailyProfile.tickets]);
    
    path.transition().duration(450)      
    .attr('d', this.medianLine);

    this.svg.select('g.markers')
     .selectAll('.point')
     .data(this.props.dailyProfile.tickets)
     .transition().duration(450)
     .on('start',function() {d3.select(this).attr("r", 5)})
     .attr('cy',d => this.scaleY(d))
     .on('end',function() {d3.select(this).attr("r", 4)})
  }

  handleMouseOver(d){
      // const current = {date:d3.timeFormat('%d/%m/%Y')(d.date), wday:d3.timeFormat('%w')(d.date),orders:d.orders,forecast:parseFloat(d.forecast).toFixed(2),sol:d.sol,trafico:d.t1}
      // this.setState({ data: this.props.dailyProfile, current: current, signature: this.state.signature });
  }

  // handleMouseClick(d){
  //     this.setState({ data: this.state.data.slice(1).slice(-30), current: this.state.current, signature: this.state.signature + 1 });
  // }

  renderProps(){
    if (this.props.dailyProfile){

      const start = d3.timeFormat('%d/%m/%Y')(new Date(this.props.dailyProfile.dates.start));
      const end = d3.timeFormat('%d/%m/%Y')(new Date(this.props.dailyProfile.dates.end));


      return (<div className='prediction-chart-current-values'>
                <div className='prediction-chart-label'>FECHAS</div>
                <div className='prediction-chart-date'>{start} - {end}</div>
                <div className='prediction-chart-label'>TICKETS</div>
                <div className='prediction-chart-value'>{this.props.dailyProfile.total}</div>
              </div>);
    }
  }

  render() {
    return (<div className='DailyProfileChart'>            
              {this.renderProps()}
              <div className='d3-chart' id={this.props.id} ref={ (divElement) => this.divElement = divElement}></div>
            </div>)
  }
}


const mapStateToProps = state =>{
  return {dailyProfile: state.dailyProfile};
}  


export default connect(mapStateToProps,{getDailyProfile})(DailyProfileChart);
