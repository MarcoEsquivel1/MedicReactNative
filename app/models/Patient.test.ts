import { PatientModel } from "./Patient"

test("can be created", () => {
  const instance = PatientModel.create({})

  expect(instance).toBeTruthy()
})
