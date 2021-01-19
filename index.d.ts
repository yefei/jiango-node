import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as pino from "pino";

export interface ApiFailDetail {
  message?: string;
  code?: number;
  httpCode?: number;
  data?: any;
}

export declare class ApiFail extends Error {
  constructor(message?: string, code?: number, data?: any, httpCode?: number);
}

interface ApiOptions {
  failCode?: number;
  failHttpCode?: number;
  success?(data: any): any;
  fail?(err: ApiFail): any;
}

interface CoreOptions {
  api?: ApiOptions;
}

export type setupCallback = (core: Core, options?: any) => Promise<void>;

export declare class Core {
  constructor(options: CoreOptions);
  koa: Koa;
  router: KoaRouter;
  loaded: string[];
  log: pino.Logger;
  defineContextCacheProperty(prop: string | number | symbol, get: (ctx: Koa.Context) => any): void;
  check(mod: string): Core;
  setup(mod: string | setupCallback, options?: any, name?: string): Core;
  boot(): Promise<void>;
  listen(port?: number): void;
  start(port?: number): void;
}

export declare class Service {
  constructor(public ctx: Koa.Context);
}

export declare function create(options: CoreOptions): Core;

declare module 'koa' {
  class Application {
    log: pino.Logger;
  }

  interface BaseContext {
    // Log
    startTime: number;
    log: pino.Logger;

    // API
    fail(msg: string | ApiFailDetail): never;
    success(data: any): any;

    // Service
    service<T>(cls: { new (ctx: Koa.Context): T }): T;
  }
}
