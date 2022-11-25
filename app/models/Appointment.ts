import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { navigate } from "../navigators"	
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const AppointmentModel = types
  .model("Appointment")
  .props({
    id: types.identifierNumber,
    doctor_id: types.integer,
    patient_id: types.integer,
    date: types.string,
    time: types.string,
    comment: types.string,
    done: types.integer,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get getId() {
      return self.id
    },
    get getDoctorId() {
      return self.doctor_id
    },
    get getPatientId() {
      return self.patient_id
    },
    get getDate() {
      return self.date
    },
    get getTime() {
      return self.time
    },
    get getComment() {
      return self.comment
    },
    get getDone() {
      return self.done
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setId(id: number) {
      self.id = id
    },
    setDoctorId(doctor_id: number) {
      self.doctor_id = doctor_id
    },
    setPatientId(patient_id: number) {
      self.patient_id = patient_id
    },
    setDate(date: string) {
      self.date = date
    },
    setTime(time: string) {
      self.time = time
    },
    setComment(comment: string) {
      self.comment = comment
    },
    setDone(done: number) {
      self.done = done
    },
    navigate() {
      navigate("AppointmentDetail", { appointment: self })
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Appointment extends Instance<typeof AppointmentModel> {}
export interface AppointmentSnapshotOut extends SnapshotOut<typeof AppointmentModel> {}
export interface AppointmentSnapshotIn extends SnapshotIn<typeof AppointmentModel> {}
export const createAppointmentDefaultModel = () => types.optional(AppointmentModel, {})
