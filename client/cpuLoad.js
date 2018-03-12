import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import './cpuLoad.css';



class CpuLoad extends Component {

  constructor(props) {
    super(props)

  }

  drawChart(){

    const {data} = this.props
    const div = new ReactFauxDOM.createElement('div');

    // set the dimensions and margins of the graph
    console.log(window.innerWidth, window.innerHeight);

    var margin = {top: 20, right: 80, bottom: 50, left: 50},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    // parse the date / time

    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

      // Scale the range of the data
      let max =d3.max(data, function(d) { return d.x; });
      x.domain(d3.extent(data, function(d) { return d.x; }));
      y.domain([0, 100]);

      // Add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", valueline);

      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y));

    return div.toReact()
  }

  render(){
    return this.drawChart();
  }

}

export default CpuLoad;
