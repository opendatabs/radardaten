import { Record } from './record';

export interface Radar {
  avgSpeed: number;
  createdAt: string;
  date: any;
  directionOneLat: number;
  directionOneLong: number;
  directionTwoLat: number;
  directionTwoLong: number;
  avgDir1?: number;
  avgDir2?: number;
  speedingQuoteDir1?: number;
  speedingQuoteDir2?: number;
  id: number;
  lat: number;
  long: number;
  records?: Record[];
  speedLimit: number;
  speedingQuote: number;
  streetName: string;
  updatedAt: string;
  count1: number;
  count2: number;
}
