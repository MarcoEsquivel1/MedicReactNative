import { ThemeStoreModel } from "./ThemeStore"

test("can be created", () => {
  const instance = ThemeStoreModel.create({})

  expect(instance).toBeTruthy()
})
