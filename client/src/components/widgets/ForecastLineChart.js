import React, { Component } from 'react';
import * as d3 from 'd3';
import './ForecastLineChart.scss';
import { connect } from 'react-redux';
import forecast from './forecast.json';

const WEEKDAYS = ['D','L','M','X','J','V','S'];

class ForecastLineChart extends Component {

  componentWillMount(){
    this.setupData();
    this.margin={left:50,right:20,top:20,bottom:30};
    this.stateSignature = 0;
    this.setState({ data: this.data, current:{date:'--- --/--/----',orders:'---',forecast:'---',sol:'---',trafico:'---'}, signature:0 });
  }

  componentDidMount() {
    this.svgWidth = this.props.width ||  this.divElement.parentElement.clientWidth;
    this.svgHeight = this.props.height || this.divElement.parentElement.clientHeight;
    this.drawChart();
    this.setState({ data: this.data, current:this.state.current, signature:this.stateSignature + 1 });
  }

  setupData(){
    // This must came in props...
    this.data = forecast;

    if (typeof(this.data[0].date) != 'string')
      return;

    // format date as a date
    this.data.forEach(function(d) {
        d.date = d3.timeParse("%Y-%m-%d")(d.date)
    });

    // sort dataset by date
    this.data.sort(function(x, y){
        return d3.ascending(x.date, y.date);
    });
  }

  dynamicTimeFormatter(time){
      return d3.timeFormat('%Y-%m-%d')(time);
  }

  componentDidUpdate() {
    console.log("UPDATE")
    this.updateChart();
  }

  makeCurveFunctions() {
    this.chartWidth = this.svgWidth - this.margin.left - this.margin.right;
    this.chartHeight = this.svgHeight - this.margin.bottom - this.margin.top;

    this.scaleY = d3.scaleLinear()
                    .range([this.chartHeight,0]);

    this.scaleX = d3.scaleTime()
                    .range([0, this.chartWidth]);
    
    this.xAxis = d3.axisBottom(this.scaleX)
                   .ticks(7)
                   .tickFormat(this.dynamicTimeFormatter);

    this.yAxis = d3.axisLeft(this.scaleY)
                   .ticks(10);

    // Create data line with real data
    this.medianLine = d3.line()
                        .x(d => this.scaleX(d.date))
                        .y(d => this.scaleY(d.orders))
                        .curve(d3.curveMonotoneX);
    this.forecastLine = d3.line()
                        .x(d => this.scaleX(d.date))
                        .y(d => this.scaleY(d.forecast))
                        .curve(d3.curveMonotoneX);
  }


  drawChart() {
    const svg = d3
      .select('#' + this.props.id)
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight);

    this.makeCurveFunctions();

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
    svg.append('g').attr('class','forecast').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    svg.append('g').attr('class','markers').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    let path = svg.select('g.path')
      .selectAll('.median-line')
      .data([this.state.data]);
      
    path.enter()
        .append('path')
        .attr('class', 'median-line')
        .attr('d', this.medianLine)
        .attr('clip-path', 'url(#rect-clip'+this.props.id+')')

    let path2 = svg.select('g.forecast')
      .selectAll('.forecast-line')
      .data([this.state.data]);
      
    path2.enter()
          .append('path')
          .attr('class', 'forecast-line')
          .attr('d', this.forecastLine)
          .attr('clip-path', 'url(#rect-clip'+this.props.id+')')

    this.addMarkers(svg);

    this.svg = svg;
  }


  updateChart() {
        
    if (this.stateSignature === this.state.signature 
     && this.dates  === this.props.dates)
       return;
      
    this.stateSignature = this.state.signature;
    this.dates = this.props.dates;

    let maxData = d3.max(this.state.data,(d)=>d.orders) || 1;
    
    this.scaleY.domain([0, maxData]);
    //this.scaleX.domain(d3.extent(this.state.data,(d)=>d.date))
    const dateRange = [d3.timeParse("%Y-%m-%d")(this.props.dates.start),d3.timeParse("%Y-%m-%d")(this.props.dates.end)];
    this.scaleX.domain(dateRange);

    this.svg.select('.x.axis').transition().duration(450).call(this.xAxis);
    this.svg.select('.y.axis').transition().duration(450).call(this.yAxis);

    let initData = [];
    
    for (let i in this.state.data){
      initData[i] = {...this.state.data[i]};
      initData[i].orders = 0;
      initData[i].forecast = 0;
    }

    let path = this.svg.select('g.path')
                  .selectAll('.median-line')
                  .data([initData]);
    
    path.attr('d', this.medianLine);

    let path2 = this.svg.select('g.forecast')
                  .selectAll('.forecast-line')
                  .data([initData]);
    
    path2.attr('d', this.forecastLine);

    setTimeout(()=>this.updateRealPath(),0);

    this.svg.select('g.markers')
      .selectAll('.point')
      .data(this.state.data)
      .exit().remove();

    setTimeout(()=>this.addMarkers(this.svg),0);    
  }

  updateRealPath(){
    let path = this.svg.select('g.path')
                  .selectAll('.median-line')
                  .data([this.state.data]);
    path.transition().duration(450)      
    .attr('d', this.medianLine);

    let path2 = this.svg.select('g.forecast')
                  .selectAll('.forecast-line')
                  .data([this.state.data]);
    path2.transition().duration(450)      
    .attr('d', this.forecastLine);
  }

  handleMouseOver(d){
    //console.log(d3.mouse(this));
      const current = {date:d3.timeFormat('%d/%m/%Y')(d.date), wday:d3.timeFormat('%w')(d.date),orders:d.orders,forecast:parseFloat(d.forecast).toFixed(2),sol:d.sol,trafico:d.t1}
      this.setState({ data: this.state.data, current: current, signature: this.state.signature });
  }

  // handleMouseClick(d){
  //     this.setState({ data: this.state.data.slice(1).slice(-30), current: this.state.current, signature: this.state.signature + 1 });
  // }

  addMarkers(svg){
    svg.select('g.markers')
    .selectAll(".point")
    .data(this.state.data)
    .enter()
    .append("circle")
     .attr("class", "point")
     .attr("index",(d, i)=> i)
     .attr("cx", d => this.scaleX(d.date))
     .attr("cy", d => this.scaleY(d.orders))
     .attr("r", d=>4)
     .attr('clip-path', 'url(#rect-clip'+this.props.id+')')
     .on('mouseover',(d)=>this.handleMouseOver(d))
    //  .on('mousedown',(d)=>this.handleMouseClick(d))

    svg.select('g.markers')
     .selectAll('.point')
     .data(this.state.data)
     .transition().duration(500)
     .on('start',function() {d3.select(this).attr("r", 5)})
     .attr("cx", d => this.scaleX(d.date))
     .attr('cy',d => this.scaleY(d.orders))      

  } 

  renderDates = ()=> (this.props.dates) ? this.props.dates.start : '---';

  render() {
    return (<div className='ForecastLineChart'>
              <div className='prediction-chart-current-values'>
                <div className='prediction-chart-label'>FECHA</div>
                <div className='prediction-chart-date'>{WEEKDAYS[this.state.current.wday]} {this.state.current.date}</div>
                <div className='prediction-chart-label'>VENTAS</div>
                <div className='prediction-chart-value'>{this.state.current.orders}</div>
                <div className='prediction-chart-label'>PREV.</div>
                <div className='prediction-chart-value forecast'>{this.state.current.forecast}</div>
                <div className='prediction-chart-label'>SOL</div>
                <div className='prediction-chart-value'>{this.state.current.sol}</div>
                <div className='prediction-chart-label'>PEATONES</div>
                <div className='prediction-chart-value'>{this.state.current.trafico}</div>
              </div>
              <div className='d3-chart' id={this.props.id} ref={ (divElement) => this.divElement = divElement}></div>
            </div>)
  }
}


const mapStateToProps = state =>{
  return {dates: state.dates};
}  

export default connect(mapStateToProps)(ForecastLineChart);
