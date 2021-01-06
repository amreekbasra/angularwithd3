import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import * as D3 from 'd3';
//declare let $: any;
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-doughnut-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {
  @Input()
  public width!: number;
  @Input()
  public height!: number;
  @Input()
  public iconWidth!: number;
  @Input()
  public iconHeight!: number;
  @Input()
  public outerRadius!: number;
  @Input()
  public innerRadius!: number;
  @Input() public data: any;
  @Input() public centerImage: any;
  @Input()
  public spreadSlice!: boolean;
  @Input()
  public chartID!: string;
  @Input()
  public middleText!: string;
  @Input()
  public middleTextColor!: string;
  @Input()
  public middleTextFontSize!: string;
  selectedId:any;
  @Output() public centerImageEvent = new EventEmitter();
  constructor(private dataService: DataService) { }

 
  title = 'Donut Chart';

    //private width: number;
    //private height: number;

    private svg: any;     // TODO replace all `any` by the right type

    private radius!: number;

    private arc: any;
    private pie: any;
    private color: any;

    private g: any;
    ngOnInit() {
      this.dataService.getPierChartData().subscribe( data =>{
        console.log('----donut---',data)
        this.initSvg();
        this.drawChart(data);
      });
      
    }

    private initSvg() {
        this.svg = D3.select('svg');

        this.width = +this.svg.attr('width');
        this.height = +this.svg.attr('height');
        this.radius = Math.min(this.width, this.height) / 2;

        this.color =d3Scale.scaleOrdinal(D3.schemeCategory10);// d3Scale.scaleOrdinal()
           // .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

        this.arc = d3Shape.arc()
            .outerRadius(this.radius - 10)
            .innerRadius(this.radius - 70);

        this.pie = d3Shape.pie()
            .sort(null)
            .value((d: any) => d.population);

        this.svg = d3.select('svg')
            .append('g')
            .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
    }

    private drawChart(data: any[]) {
        let g = this.svg.selectAll('.arc')
            .data(this.pie(data))
            .enter().append('g')
            .attr('class', 'arc');

        g.append('path')
            .attr('d', this.arc)
            .style('fill', (d:any) => this.color(d.data.Framework));

        g.append('text')
            .attr('transform', (d:any) => 'translate(' + this.arc.centroid(d) + ')')
            .attr('dy', '.35em')
            .text((d:any) => d.data.Framework);
    }
}
