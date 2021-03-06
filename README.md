[![Build Status](https://travis-ci.com/aex-ts-node/session.svg?branch=master)](https://travis-ci.com/aex-ts-node/session)[![Coverage Status](https://coveralls.io/repos/github/aex-ts-node/session/badge.svg?branch=master)](https://coveralls.io/github/aex-ts-node/session?branch=master)
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

## MemoryStore

```ts
import { MemoryStore, Cookie } from "@aex/session";
import * as http from "http";
const store = new MemoryStore();
const cookie = new Cookie(store);
const scope: any = {};
const server = http
  .createServer(function (req: any, res: any) {
    cookie.parse(req, res, scope).then(() => {
      scope.session.user = "alice";
      res.write("Hello World!");
      res.end();
    });
  })
  .listen(port);
```

## RedisStore

RedisStore uses `node-redis` and takes exactly what `createClient` takes which described [here](https://github.com/NodeRedis/node-redis#rediscreateclient);

```ts
import { RedisStore, Cookie } from "@aex/session";
import * as http from "http";
const store = new RedisStore();
const cookie = new Cookie(store);
const scope: any = {};
const server = http
  .createServer(function (req: any, res: any) {
    cookie.parse(req, res, scope).then(() => {
      scope.session.user = "alice";
      res.write("Hello World!");
      res.end();
    });
  })
  .listen(port);
```

> `scope` is optional. If scope is not provided, session will be attached to `req`, make sure session is request specific even scope can be global.
