import { AuthStoreModel } from "./AuthStore"

test("can be created", () => {
  const instance = AuthStoreModel.create({})

  expect(instance).toBeTruthy()
})
