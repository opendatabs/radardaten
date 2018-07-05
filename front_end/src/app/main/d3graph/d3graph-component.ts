import {Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit} from '@angular/core';

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
import * as moment from 'moment';
import {ColorService} from "../../shared/color.service";
import {Record} from "../../shared/record";

declare var $:any;

@Component({
  selector: 'app-d3graph',
  templateUrl: './d3graph-component.html',
  styleUrls: ['./d3graph-component.css']
})
export class D3graphComponent implements OnInit, OnChanges {

  @Input() records: Record[];
  @Input() speedLimit: number;
  @Input() groupBy: string;

  stackedData: any[];

  private d3: D3;
  private parentNativeElement: any;

  private svg: any;
  private colors: any = [];
  private padding: number = 25;
  private width: number;
  private height: number = 300;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private rects: any;

  constructor(
    element: ElementRef,
    private ngZone: NgZone,
    d3Service: D3Service,
    private dataService: DataService,
    private colorService: ColorService
  ){
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
    moment.locale('de-ch');
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.records && changes.records.currentValue && !changes.records.previousValue) {
      this.stackedData = this.stackData(changes.records.currentValue);
      this.initChart();
      this.updateChart();
    } else if (changes.records && changes.records.currentValue) {
      this.stackedData = this.stackData(changes.records.currentValue);
      this.updateChart();
    } else if ( changes.groupBy && changes.groupBy.currentValue) {
      this.stackedData = this.stackData(this.records);
      this.initChart();
      this.updateChart();
    }
  }

  stackData(records: Record[]) {
    const self = this;
    let nested = this.d3.nest<Record, {count:number, avgSpeed:number}>()
      .key(function(d: Record) {
        if (self.groupBy === 'days') {
          return moment(d.timestamp).format('YYYY-MM-DD');
        } else {
          return moment(d.timestamp).format('HH')
        }
      })
      .rollup(function(v:any) {
        return {
          count: v.length,
          avgSpeed: self.d3.mean(v, function (d:any) {return d.kmh})
        };
      })
      .entries(records);
    console.log(nested);
    return nested;
  }

  initChart() {
    let self = this;
    let d3 = this.d3;
    this.width = $("#map").width();

    $(this.parentNativeElement).find('svg').remove();
    if (this.parentNativeElement !== null) {
      self.svg = d3.select(this.parentNativeElement)
        .append('svg')        // create an <svg> element
        .attr('width', self.width) // set its dimensions
        .attr('height', self.height);

      self.stackedData = this.stackedData;

      const weekDomain = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
      const hoursDomain = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22', '23'];
      let domain;
      (self.groupBy === 'days') ? domain = weekDomain : domain = hoursDomain;
      self.xScale = d3.scaleBand()
        .domain(domain)
        .range([0, (self.width - (2*self.padding))])
        .padding(.1);

      self.yScale = d3.scaleLinear()
        .domain([self.speedLimit, 0])
        .range([0, (self.height- (2*self.padding))]);

      self.xAxis = d3.axisBottom(self.xScale) // d3.js v.4
        .scale(self.xScale)
        .ticks(7);

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
      .data(self.stackedData);

    self.rects
      .enter()
      .append('rect')
      .attr('x', function(d,i) {
        if (self.groupBy === 'days') {
          return self.xScale(moment(d.key).format('dddd')) + self.padding;
        } else {
          return self.xScale(d.key) + self.padding;
        }
      })
      .attr('y', function(d) {
        return self.yScale(d.value.avgSpeed) + self.padding;
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.value.avgSpeed) - (2*self.padding)})
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.perc2color2(d.value.avgSpeed, self.speedLimit);
      });

    self.rects
      .transition()
      .attr('x', function(d,i) {
        if (self.groupBy === 'days') {
          return self.xScale(moment(d.key).format('dddd')) + self.padding;
        } else {
          return self.xScale(d.key) + self.padding;
        }
      })
      .attr('y', function(d) {
        return self.yScale(d.value.avgSpeed) + self.padding;
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        return self.height - self.yScale(d.value.avgSpeed) - (2*self.padding)})
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.perc2color2(d.value.avgSpeed, self.speedLimit);
      });
  }
}
