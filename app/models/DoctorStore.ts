import { th } from "date-fns/locale"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import MedicApiService from "../services/MedicAPI"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const DoctorStoreModel = types
  .model("DoctorStore")
  .props({
    isError: types.optional(types.boolean, false),
    errorMessage: types.optional(types.string, ""),
    isLoading: types.optional(types.boolean, false),
    nombre_doctor: types.optional(types.string, ""),
    start_time: types.optional(types.string, ""),
    end_time: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get getIsLoading() {
      return self.isLoading
    },
    get getIsError() {
      return self.isError
    },
    get getErrorMessage() {
      return self.errorMessage
    },
    get getNombreDoctor() {
      return self.nombre_doctor
    },
    get getStartTime() {
      return self.start_time
    },
    get getEndTime() {
      return self.end_time
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setNombreDoctor: (nombre_doctor: string) => {
      self.nombre_doctor = nombre_doctor
    },
    setStartTime: (start_time: string) => {
      self.start_time = start_time
    },
    setEndTime: (end_time: string) => {
      self.end_time = end_time
    },
    setIsLoading: (isLoading: boolean) => {
      self.isLoading = isLoading
    },
    setIsError: (isError: boolean) => {
      self.isError = isError
    },
    setErrorMessage: (errorMessage: string) => {
      self.errorMessage = errorMessage
    },
    async clearDoctor() {
      this.setNombreDoctor("")
      this.setStartTime("")
      this.setEndTime("")
      this.setErrorMessage("")
      this.setIsError(false)
    },
    async getDoctor(token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.getDoctor("Bearer " + token)
      if (response.status === 200) {
        this.setNombreDoctor(response.data.name)
        this.setStartTime(response.data.start_time)
        this.setEndTime(response.data.end_time)
        this.setErrorMessage(response.message)
      }else{
        this.setErrorMessage(response.data.message)
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async updateDoctor(token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.updateDoctor("Bearer " + token, self.nombre_doctor, self.start_time, self.end_time)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setNombreDoctor(response.data.name)
        this.setStartTime(response.data.start_time)
        this.setEndTime(response.data.end_time)
      }else{
        this.setErrorMessage(response.data.message)
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DoctorStore extends Instance<typeof DoctorStoreModel> {}
export interface DoctorStoreSnapshotOut extends SnapshotOut<typeof DoctorStoreModel> {}
export interface DoctorStoreSnapshotIn extends SnapshotIn<typeof DoctorStoreModel> {}
export const createDoctorStoreDefaultModel = () => types.optional(DoctorStoreModel, {})
