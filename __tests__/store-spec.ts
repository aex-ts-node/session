import { MemoryStore } from "../src/index";

test("Should create object", async () => {
  expect(MemoryStore).toBeTruthy();

  const store = new MemoryStore();
  const id = "aaa";
  let data = await store.get(id);
  expect(data).toBeFalsy();
  await store.set(id, { sss: 11 });
  data = await store.get(id);
  expect(data.sss === 11).toBeTruthy();
  await store.destroy(id);
  data = await store.get(id);
  expect(data === undefined).toBeTruthy();
});
