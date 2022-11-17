import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const PatientModel = types
  .model("Patient")
  .props({
    id: types.identifierNumber,
    doctor_id: types.integer,
    name: types.string,
    phone: types.string,
    dni: types.string,
    birthday: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get getId() {
      return self.id
    },
    get getDoctorId() {
      return self.doctor_id
    },
    get getName() {
      return self.name
    },
    get getPhone() {
      return self.phone
    },
    get getDni() {
      return self.dni
    },
    get getBirthday() {
      return self.birthday
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setId(id: number) {
      self.id = id
    },
    setDoctorId(doctor_id: number) {
      self.doctor_id = doctor_id
    },
    setName(name: string) {
      self.name = name
    },
    setPhone(phone: string) {
      self.phone = phone
    },
    setDni(dni: string) {
      self.dni = dni
    },
    setBirthday(birthday: string) {
      self.birthday = birthday
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Patient extends Instance<typeof PatientModel> {}
export interface PatientSnapshotOut extends SnapshotOut<typeof PatientModel> {}
export interface PatientSnapshotIn extends SnapshotIn<typeof PatientModel> {}
export const createPatientDefaultModel = () => types.optional(PatientModel, {})
