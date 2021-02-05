import { Store } from "../types";

export class MemoryStore extends Store {
  storage: any = {};
  public async set(k: string, v: any) {
    this.storage[k] = v;
  }

  public async get(k: string) {
    return this.storage[k];
  }

  public async destroy(k: string) {
    delete this.storage[k];
  }
}
