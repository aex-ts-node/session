import { v4 } from "uuid";
import { IncomingMessage, ServerResponse } from "http";
import { Cookie } from "./cookie";


export class Session {

  private cookie: Cookie;
  private store: Store;
  private sessionName: string;

  constructor(cookie: Cookie, store: Store, sessionName: string = "sid") {
    this.cookie = cookie;
    this.store = store;
    this.sessionName = sessionName
  }

  public toMiddleware() {
    const self = this;

    return async function (req: IncomingMessage, res: ServerResponse, scope: any) {
      await self.init(req, res, scope);
    }
  }

  public async init(req: IncomingMessage, res: ServerResponse, scope: any) {
    const parsed = this.cookie.parse(req);
    if (!parsed) {
      res.setHeader('Set-Cookie', this.cookie.serialize(this.sessionName, v4()));
      scope.session = {};
      return;
    } else if (Object.keys(parsed).length) {
      const id = parsed[this.sessionName];
      scope.session = await this.store.get(id);

      // store all session data into store after the request
      process.nextTick(async () => {
        await this.store.set(id, scope.session);
      });
    } else {
      scope.session = {};
    }

  }

  public touch() {
    this.resetMaxAge();
  }

  public resetMaxAge() {
  }

  public async save(id: string, data: any) {
    await this.store.set(id, data);
  }
  public async get(id: string) {
    return await this.store.get(id);
  }
  public async destroy(id: string) {
    return await this.store.destroy(id);
  }

  public async regenerate(id: string) {
    return await this.store.reset(id);
  }
}
