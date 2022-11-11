import { DoctorStoreModel } from "./DoctorStore"

test("can be created", () => {
  const instance = DoctorStoreModel.create({})

  expect(instance).toBeTruthy()
})
