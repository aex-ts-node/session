[![Build Status](https://travis-ci.org/aex-ts-node/session.svg?branch=master)](https://travis-ci.org/aex-ts-node/session.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/aex-ts-node/session/badge.svg?branch=master)](https://coveralls.io/github/aex-ts-node/session?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# @aex/session

## Generic Node.js Session

This package is created for Aex, but it is useful for Node.js `http` callback.

# Install

```ts
npm install @aex/session
# or
yarn add @aex/session
```

# Usage

```ts
import { MemoryStore, Cookie } from "@aex/session";
import * as http from "http";

const store = new MemoryStore();
const cookie = new Cookie(store);
const scope: any = {};
const server = http
  .createServer(function(req: any, res: any) {
    cookie.parse(req, res, scope).then(() => {
      scope.session.user = "alice";
      res.write("Hello World!");
      res.end();
    });
  })
  .listen(port);
```

> `scope` is optional. If scope is not provided, session will be attached to `req`.
