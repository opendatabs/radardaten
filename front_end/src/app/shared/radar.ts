import {Record} from "./record";

export interface Radar {
  avgSpeed: number;
  createdAt: string;
  date: string;
  directionOneLat: number;
  directionOneLong: number;
  directionTwoLat: number;
  directionTwoLong: number;
  directionOneMeanKmh?: number;
  directionTwoMeanKmh?: number;
  id: number;
  lat: number;
  long: number;
  records: Record[];
  speedLimit: number;
  speedingQuote: number;
  streetName: string;
  updatedAt: string;
}
