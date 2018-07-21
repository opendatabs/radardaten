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
import {WeeklyRecord} from "../../shared/weekly-record";
import {Radar} from "../../shared/radar";

declare var $:any;

@Component({
  selector: 'app-d3graph',
  templateUrl: './d3graph-component.html',
  styleUrls: ['./d3graph-component.css']
})
export class D3graphComponent implements OnInit, OnChanges {

  @Input() data: WeeklyRecord[];
  @Input() radar: Radar;
  @Input() speedLimit: number;
  @Input() groupBy: string;
  @Input() clickable: boolean;
  @Input() measure: string;

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
    if (changes.data && changes.data.currentValue && !changes.data.previousValue) {
      this.initChart();
      this.updateChart();
    } else if (this.data && changes.measure && changes.measure.currentValue) {
      this.initChart();
      this.updateChart();
    }
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

      self.data = this.data;

      const weekDomain = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
      const hoursDomain = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22', '23'];
      let domain;
      (self.groupBy === 'days') ? domain = weekDomain : domain = hoursDomain;
      self.xScale = d3.scaleBand()
        .domain(domain)
        .range([0, (self.width - (2*self.padding))])
        .padding(.1);

      const avgDomain = [self.speedLimit, 0];
      const speedingQuoteDomain = [.7, 0];
      (self.measure === 'average') ? domain = avgDomain : domain = speedingQuoteDomain;

      self.yScale = d3.scaleLinear()
        .domain(domain)
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

    let countMax = self.d3.max(self.data.map(d => d.count));

    let div = this.d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    self.rects = self.svg.selectAll('rect')
      .data(self.data);

    self.rects
      .enter()
      .append('rect')
      .attr('x', function(d,i) {
        if (self.groupBy === 'days') {
          return self.xScale(moment(d.timestamp).format('dddd')) + self.padding;
        } else {
          return self.xScale(d.timestamp) + self.padding;
        }
      })
      .attr('y', function(d) {
        if (self.measure === 'average') {
          return self.yScale(d.avgSpeed) + self.padding;
        } else {
          return self.yScale(d.speedingQuote) + self.padding;
        }
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        if (self.measure === 'average') {
          return self.height - self.yScale(d.avgSpeed) - (2 * self.padding)
        } else {
          return self.height - self.yScale(d.speedingQuote) - (2 * self.padding)
        }
      })
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.numberToColor(d.count, countMax);
      })
      .attr('opacity', function(d, i) {
        return self.colorService.numberToOpacity(d.count, countMax);
      })
      .attr('stroke', 'black')
      .classed('clickable', this.clickable)
      .on("mouseover", function(d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(`Anzahl Fahrzeuge: ${d.count}<br/>Ø (km/h): ${d.avgSpeed}<br/>Übertretungsquote: ${d.speedingQuote}`)
          .style("left", (self.d3.event.pageX) + "px")
          .style("top", (self.d3.event.pageY - 28) + "px");
      })
      .on('mousemove', function (d) {
        div.style("left", (self.d3.event.pageX) + "px")
          .style("top", (self.d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    self.rects
      .transition()
      .attr('x', function(d,i) {
        if (self.groupBy === 'days') {
          return self.xScale(moment(d.timestamp).format('dddd')) + self.padding;
        } else {
          return self.xScale(d.timestamp) + self.padding;
        }
      })
      .attr('y', function(d) {
        if (self.measure === 'average') {
          return self.yScale(d.avgSpeed) + self.padding;
        } else {
          return self.yScale(d.speedingQuote) + self.padding;
        }
      })
      // .attr("transform","translate(" + (self.padding -5  + 25) + "," + (self.padding - 5) + ")")
      .attr('height', function(d) {
        if (self.measure === 'average') {
          return self.height - self.yScale(d.avgSpeed) - (2 * self.padding)
        } else {
          return self.height - self.yScale(d.speedingQuote) - (2 * self.padding)
        }
      })
      .attr('width', self.xScale.bandwidth())
      .attr('fill', function(d, i) {
        return self.colorService.numberToColor(d.count, countMax);
      })
      .attr('opacity', function(d, i) {
        return self.colorService.numberToOpacity(d.count, countMax);
      })
      .attr('stroke', 'black');
  }
}
