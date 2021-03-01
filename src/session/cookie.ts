import * as cookie from 'cookie';
import { IncomingMessage, ServerResponse } from 'http';
import { v4 } from 'uuid';
import { Session, Store } from '../types';

interface ICookieOptionInput {
  maxAge?: number;
  httpOnly?: boolean;
  expires?: Date;
  path?: string;
  domain?: string;
  // secure?: boolean;
  [x: string]: any;
}

interface ICookieOptions {
  maxAge: number;
  httpOnly: boolean;
  expires: Date;
  path: string;
  domain: string;
  // secure: boolean;
  [x: string]: any;
}

export class Cookie extends Session {
  public async parse(req: IncomingMessage, res: ServerResponse, scope?: any) {
    const header = req.headers['cookie'] || '';
    const parsed: any = cookie.parse(header);
    let id: string;
    if (!scope) {
      scope = req;
    }
    if (parsed[this.name]) {
      id = parsed[this.name];
      let session = await this.store.get(id);
      if (!session) {
        scope.session = { id };
      } else {
        if (new Date(parsed.Expires).getTime() < Date.now()) {
          await this.store.destroy(id);
          id = v4();
          res.setHeader('Set-Cookie', this.serialize(this.name, id));
          scope.session = { id };
        } else {
          parsed.expires = new Date(Date.now() + this.options.maxAge);
          res.setHeader('Set-Cookie', cookie.serialize(this.name, id, parsed));
          scope.session = session;
        }
      }
    } else {
      id = v4();
      res.setHeader('Set-Cookie', this.serialize(this.name, id));
      scope.session = { id };
    }

    scope.session.save = async () => {
      await this.store.set(id, scope.session);
    }
    // store all session data into store after the request
    setImmediate(async () => {
      await this.store.set(id, scope.session);
    });
  }

  public options: ICookieOptions = {
    maxAge: 1000 * 60 * 10,
    httpOnly: true,
    path: '/',
    expires: new Date(),
    domain: '',
    secure: false,
  };

  constructor(
    store: Store,
    options: ICookieOptionInput = {},
    name: string = 'aexId'
  ) {
    super(name, store);
    for (const key of Object.keys(options)) {
      this.options[key] = options[key];
    }
  }

  public getId(header: string): string {
    const parsed = cookie.parse(header);
    return parsed[this.name];
  }

  public serialize(name: string, val: string) {
    this.options.expires = new Date(Date.now() + this.options.maxAge);
    return cookie.serialize(name, val, this.options);
  }
}
