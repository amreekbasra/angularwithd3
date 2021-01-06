import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from 'src/app/services/data.service';
import { PieChartData } from 'src/app/models/barchart-data';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit,AfterViewInit {
  @ViewChild("containerPieChart")
  element!: ElementRef;
  private host: any;
    private htmlElement!: HTMLElement;

  private svg: any;
  private margin = 50;
  private width = 750;
  private height = 600;
   private data: Array<PieChartData> = new Array<PieChartData>();
   private pieData = [1, 2, 3, 4, 5]
  // // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  private colors: any;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // console.log('init')
    this.buildChart();

  }

  ngAfterViewInit() {
    this.htmlElement = this.element.nativeElement;
    this.host = d3.select(this.htmlElement);
    // this.setup();
    // this.buildSVG();
    // this.buildPie();
}

buildChart(){
  d3.select('svg').remove();
  this.dataService.getPierChartData().subscribe(data => {
    console.log(data);
     this.data = data;
    this.createSvg();
    this.createColors();
    this.drawChart();
  });
}
// private setup(): void {
//   this.width = 250;
//   this.height = 250;
//   this.radius = Math.min(this.width, this.height) / 2;
// }

// private buildSVG(): void {
//   this.host.html("");
//   this.svg = this.host.append("svg")
//       .attr("viewBox", `0 0 ${this.width} ${this.height}`)
//       .append("g")
//       .attr("transform", `translate(${this.width / 2},${this.height / 2})`);
// }

// private buildPie(): void {
//   let pie = d3.pie();
//   let arcSelection = this.svg.selectAll(".arc")
//       .data(pie(this.pieData))
//       .enter()
//       .append("g")
//       .attr("class", "arc");

//   this.populatePie(arcSelection);
// }

// private populatePie(arcSelection:any): void {
//   let innerRadius = this.radius - 50;
//   let outerRadius = this.radius - 10;
//   let pieColor = d3.scaleOrdinal(d3.schemeCategory10)
//   let arc = d3.arc()
//       .outerRadius(outerRadius);
//   arcSelection.append("path")
//       .attr("d", arc)
//       .attr("fill", (datum: any, index: any) => {
//           return pieColor(`${index}`);
//       });

//   arcSelection.append("text")
//       .attr("transform", (datum: any) => {
//           datum.innerRadius = 0;
//           datum.outerRadius = outerRadius;
//           return "translate(" + arc.centroid(datum) + ")";
//       })
//       .text((datum: any, index: number) => this.pieData[index])
//       .style("text-anchor", "middle");
// }
  private createSvg(): void {
    
    this.htmlElement = this.element.nativeElement;
    this.svg = d3.select(this.htmlElement)
   // this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }
  private createColors(): void {
    this.colors =d3.scaleOrdinal(d3.schemeCategory10)//;// d3.scaleOrdinal()
     // .domain(this.data.map(d => d.Stars.toString()));
     // .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }
  onResize() {
    console.log('on resize called');
    this.buildChart();
  }
  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(this.radius/2)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: any) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: { data: { Framework: any; }; }) => d.data.Framework)
      .attr("transform", (d: d3.DefaultArcObject) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }
}
