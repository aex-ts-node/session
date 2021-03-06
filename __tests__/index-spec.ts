import { MemoryStore, Cookie } from '../src/index';

import * as bent from 'bent';
import * as http from 'http';

test('MemoryStore should work', async () => {
  expect(MemoryStore).toBeTruthy();

  const store = new MemoryStore();
  const id = 'aaa';
  let data = await store.get(id);
  expect(data).toBeFalsy();
  await store.set(id, { sss: 11 });
  data = await store.get(id);
  expect(data.sss === 11).toBeTruthy();
  await store.destroy(id);
  data = await store.get(id);
  expect(data === undefined).toBeTruthy();
});

test('Cookie should work', async () => {
  expect(Cookie).toBeTruthy();

  const store = new MemoryStore();
  const cookie = new Cookie(store);

  const scope: any = {};

  const port = Math.floor(Math.random() * 10000 + 10000);

  //create a server object:
  const server = http
    .createServer(function (req: any, res: any) {
      cookie.parse(req, res, scope).then(async () => {
        if (req.url === '/session') {
          scope.session.user = 'alice';
          await scope.session.save();
        }
        scope.session.user = 'aaa';
        res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
      });
    })
    .listen(port); //the server object listens on port 8080

  const getStream: any = bent('http://localhost:' + port);

  let stream = await getStream('/');
  const header1 = stream.headers['set-cookie'][0];
  expect(header1).toBeTruthy();

  const getStream1: any = bent('http://localhost:' + port);

  let sessioned = await getStream1('/session', null, {
    Cookie: header1,
  });

  const header2 = sessioned.headers['set-cookie'][0];

  const unserialized1 = cookie.getId(header1);
  const unserialized2 = cookie.getId(header2);

  expect(unserialized1 === unserialized2).toBeTruthy();

  let sessioned1 = await getStream1('/session', null, {
    Cookie:
      'aexId=cdb614b1-3f31-4e55-9826-bced2f7903b7; Max-Age=600000; Path=/; Expires=Fri, 19 Feb 2021 10:12:10 GMT; HttpOnly',
  });

  expect(sessioned1).toBeTruthy();
  server.close();
});

test('Cookie should work', async () => {
  expect(Cookie).toBeTruthy();

  const store = new MemoryStore();
  const cookie = new Cookie(store, {
    maxAge: 1000,
  });
  const port = Math.floor(Math.random() * 10000 + 10000);

  //create a server object:
  const server = http
    .createServer(function (req: any, res: any) {
      cookie.parse(req, res).then(() => {
        res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
      });
    })
    .listen(port); //the server object listens on port 8080

  const getStream: any = bent('http://localhost:' + port);

  let stream = await getStream('/');
  const header1 = stream.headers['set-cookie'][0];
  expect(header1).toBeTruthy();

  await new Promise((resovle) => {
    setTimeout(async () => {
      const getStream1: any = bent('http://localhost:' + port);

      let sessioned = await getStream1('/', null, {
        Cookie: header1,
      });

      const header2 = sessioned.headers['set-cookie'][0];

      const unserialized1 = cookie.getId(header1);
      const unserialized2 = cookie.getId(header2);

      expect(unserialized1 !== unserialized2).toBeTruthy();
      resovle(false);
    }, 2000);
  });

  server.close();
});
