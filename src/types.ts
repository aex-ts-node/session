import { IncomingMessage, ServerResponse } from "http";

export abstract class Store {
  abstract set(id: string, value: any): any;

  abstract get(id: string): any;

  abstract destroy(id: string): any;
}

export abstract class Session {
  protected name: string;
  protected store: Store;
  constructor(name: string, store: Store) {
    this.name = name;
    this.store = store;
  }
  abstract parse(req: IncomingMessage, res: ServerResponse, scope: any): any;
}
