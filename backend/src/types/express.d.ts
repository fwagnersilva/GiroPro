import { Router as ExpressRouter } from 'express';

declare module 'express' {
  export interface Router extends ExpressRouter {}
}
