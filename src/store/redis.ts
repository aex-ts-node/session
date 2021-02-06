import { Store } from '../types';

import { createClient, ClientOpts, RedisClient } from 'redis';

export class RedisStore extends Store {
  private storage: RedisClient;
  constructor(options?: ClientOpts) {
    super();
    this.storage = createClient(options);
  }

  public async set(k: string, v: any) {
    this.storage.set(k, JSON.stringify(v));
  }

  public async get(k: string) {
    return new Promise((resolve, reject) => {
      this.storage.get(k, (error, reply) => {
        if (error) {
          return reject(error);
        }
        if (reply) {
          resolve(JSON.parse(reply.toString()));
        } else {
          resolve(undefined);
        }
      });
    });
  }

  public async destroy(k: string) {
    this.storage.set(k, '');
  }

  public async disconnect() {
    this.storage.quit();
  }
}
