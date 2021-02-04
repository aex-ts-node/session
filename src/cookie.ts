
import * as cookie from 'cookie';
import { IncomingMessage } from 'http';

interface ICookieOptions {
  maxAge: number;
  httpOnly: boolean,
  expires: Date,
  path: string,
  domain: string,
  secure: boolean,
  sameSite: boolean,
}

export class Cookie {
  private originalMaxAge: number = 1000 * 60;
  public options: ICookieOptions;
  constructor(options: ICookieOptions) {
    this.options = options;
  }

  public parse(req: IncomingMessage) {
    const header = req.headers['cookie'];
    if(!header) {
      return;
    }
    return cookie.parse(header);
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

