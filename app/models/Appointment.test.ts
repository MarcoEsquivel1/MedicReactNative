import { AppointmentModel } from "./Appointment"

test("can be created", () => {
  const instance = AppointmentModel.create({})

  expect(instance).toBeTruthy()
})
