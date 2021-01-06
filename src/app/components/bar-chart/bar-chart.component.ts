import { Component, OnInit, OnChanges } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges, OnInit {
  svg:any;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);
  constructor(private dataService: DataService) { }
  ngOnInit(): void {
    // console.log('init')
    this.dataService.getBarChartData().subscribe( data =>{
      console.log(data)
      this.createSvg();
      this.drawBars(data);
    });
  }


  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.dataService.getBarChartData().subscribe( data =>{
      console.log(data)
      this.createSvg();
      this.drawBars(data);
    });
  
  }
  private createSvg(): void {
    this.svg = d3.select("figure#bar")
      .append("svg")
      .attr("width", this.width + (this.margin * 2))
      .attr("height", this.height + (this.margin * 2))
      .append("g")
      .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  }
  private drawBars(data: any[]): void {
    // Create the X-axis band scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(data.map(d => d.Framework))
      .padding(0.2);

    // Draw the X-axis on the DOM
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
      .domain([0, 200000])
      .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    this.svg.append("g")
      .call(d3.axisLeft(y));

    // Create and fill the bars
    this.svg.selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d: { Framework: string; }) => x(d.Framework))
      .attr("y", (d: { Stars: d3.NumberValue; }) => y(d.Stars))
      .attr("width", x.bandwidth())
      .attr("height", (d: { Stars: d3.NumberValue; }) => this.height - y(d.Stars))
      .attr("fill", "#d04a35");
  }

}
