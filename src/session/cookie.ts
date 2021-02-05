import * as cookie from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import { v4 } from "uuid";
import { Session, Store } from "../types";

interface ICookieOptionInput {
  maxAge?: number;
  httpOnly?: boolean;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  [x: string]: any;
}

interface ICookieOptions {
  maxAge: number;
  httpOnly: boolean;
  expires: Date;
  path: string;
  domain: string;
  secure: boolean;
  [x: string]: any;
}

export class Cookie extends Session {
  public async parse(req: IncomingMessage, res: ServerResponse, scope: any) {
    const header = req.headers["cookie"];
    if (!header) {
      return;
    }
    const parsed = cookie.parse(header);
    let id: string;
    if (parsed[this.name]) {
      id = parsed[this.name];
      scope.session = await this.store.get(id);
    } else {
      id = v4();
      res.setHeader("Set-Cookie", this.serialize(this.name, id));
      scope.session = {};
    }
    // store all session data into store after the request
    process.nextTick(async () => {
      await this.store.set(id, scope.session);
    });
  }
  public async save(id: string, session: any) {
    await this.store.set(id, session);
  }
  public async update(id: string) {
    this.options.expires = new Date(Date.now() + this.options.maxAge);
    await this.store.set(id, this.options);
  }
  private originalMaxAge: number = 1000 * 60;
  public options: ICookieOptions = {
    maxAge: 0,
    httpOnly: true,
    path: "/",
    expires: new Date(),
    domain: "",
    secure: false
  };

  constructor(name: string, store: Store, options: ICookieOptionInput) {
    super(name, store);
    for (const key of Object.keys(options)) {
      this.options[key] = options[key];
    }
  }

  public reset() {
    this.options.maxAge = this.originalMaxAge;
  }
  public serialize(name: string, val: string) {
    return cookie.serialize(name, val, this.options);
  }
  public toJSON() {
    return this.options;
  }
}
