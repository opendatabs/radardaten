import { Component, ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';
import {DataService} from "../../shared/data-service.service";
import {Radar} from "../../shared/radar";

@Component({
  selector: 'app-d3graph',
  templateUrl: './d3graph-component.html',
  styleUrls: ['./d3graph-component.css']
})
export class D3graphComponent implements OnInit {
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  private d3ParentElement: any;
  private svg: any;
  private name: string;
  private yVal: number;
  private colors: any = [];
  private data: {name: string, yVal: number}[] = [];
  private padding: number = 25;
  private width: number = 500;
  private height: number = 150;
  private xScale: any;
  private yScale: any;
  private xColor: any;
  private xAxis: any;
  private yAxis: any;
  private rects: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private dataService: DataService
  ){
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnInit() {
    this.dataService.getDetailData().subscribe((data:any[]) => {
      this.data = data;
      this.initChart();
      this.updateChart();
    }, err => {
      console.log(err);
      alert('an error occured');
    })
  }

  update() {
    this.dataService.getDetailData2().subscribe((data:any[]) => {
      this.data = data;
      this.updateChart();
    }, err => {
      console.log(err);
      alert('an error occured');
    })
  }

  initChart() {
    let self = this;
    let d3 = this.d3;

    if (this.parentNativeElement !== null) {
      self.svg = d3.select(this.parentNativeElement)
        .append('svg')        // create an <svg> element
        .attr('width', self.width) // set its dimensions
        .attr('height', self.height);

      self.colors = ['red', 'yellow', 'green', 'blue'];

      self.data = this.data;

      self.xScale = d3.scaleBand()
        .domain(self.data.map(function(d){ return d.name; }))
        .range([0, 200]);

      self.yScale = d3.scaleLinear()
        .domain([0,d3.max(self.data, function(d) {return d.yVal})])
        .range([100, 0]);

      self.xAxis = d3.axisBottom(self.xScale) // d3.js v.4
        .ticks(5)
        .scale(self.xScale);

      self.yAxis = d3.axisLeft(self.xScale) // d3.js v.4
        .scale(self.yScale)
        .ticks(7);

      self.svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (self.padding) + "," + self.padding + ")")
        .call(self.yAxis);

      self.svg.append('g')            // create a <g> element
        .attr('class', 'axis')   // specify classes
        .attr("transform", "translate(" + self.padding + "," + (self.height - self.padding) + ")")
        .call(self.xAxis);            // let the axis do its thing
    }
  }

  updateChart() {
    let self = this;
    self.rects = self.svg.selectAll('rect')
      .data(self.data);

    self.rects
      .enter()
      .append('rect')
      .attr('x', function(d,i) {
        return self.xScale(d.name );
      })
      .attr('y', function(d) {
        return self.yScale(d.yVal);
      })
      .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.yVal) - (2*self.padding) + 5})
      .attr('width', 10)
      .attr('fill', function(d, i) {
        return self.colors[i];
      });

    self.rects
      .transition()
      .attr('x', function(d,i) {
        return self.xScale(d.name );
      })
      .attr('y', function(d) {
        return self.yScale(d.yVal);
      })
      .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.yVal) - (2*self.padding) + 5})
      .attr('width', 10)
      .attr('fill', function(d, i) {
        return self.colors[i];
      });
  }
}
