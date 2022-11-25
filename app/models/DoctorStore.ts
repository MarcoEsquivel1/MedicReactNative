import { th } from "date-fns/locale"
import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import MedicApiService from "../services/MedicAPI"
import { mapPatient, mapAppointment } from "../utils/mapping"
import { Appointment, AppointmentModel } from "./Appointment"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Patient, PatientModel } from "./Patient"

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
    patientsList: types.optional(types.array(PatientModel), []),
    appointmentsList: types.optional(types.array(AppointmentModel), []),
    pendingAppointmentsList: types.optional(types.array(types.reference(AppointmentModel)), []),
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
    },
    get getPatientsList() {
      return self.patientsList
    },
    get getAppointmentsList() {
      return self.appointmentsList
    },
    get getPendingAppointmentsList() {
      return self.pendingAppointmentsList
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
        this.setIsError(false)
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
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
        this.setIsError(false)
        this.setNombreDoctor(response.data.name)
        this.setStartTime(response.data.start_time)
        this.setEndTime(response.data.end_time)
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async getPatients(token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.getPatients("Bearer " + token)
      if (response.status === 200) {
        this.setErrorMessage("")
        this.setIsError(false)
        const patients = response.data        
        const mappedPatients = patients.map(mapPatient)
        self.setProp("patientsList", [])
        self.setProp("patientsList", mappedPatients)     
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async addPatient(name: string, dni: string, phone: string, birthday: string, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.addPatient("Bearer " + token, name, dni, phone, birthday)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const patients = response.data        
        const mappedPatients = patients.map(mapPatient)
        self.setProp("patientsList", [])
        self.setProp("patientsList", mappedPatients)
        
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async updatePatient(id: number, name: string, dni: string, phone: string, birthday: string, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.updatePatient("Bearer " + token, id, name, dni, phone, birthday)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const patients = response.data        
        const mappedPatients = patients.map(mapPatient)
        self.setProp("patientsList", [])
        self.setProp("patientsList", mappedPatients)
        
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async deletePatient(id: number, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.deletePatient("Bearer " + token, id)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const patients = response.data        
        const mappedPatients = patients.map(mapPatient)
        self.setProp("patientsList", [])
        self.setProp("patientsList", mappedPatients)
        
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    findPatient(id: number) {
      //find patient in patientsList
      const patient: Patient = self.patientsList.find((patient: Patient) => patient.id === id)
      if (patient) {
        return patient
      } else {
        return null
      }
    },
    getPatientsIdandNames() {
      //create array list with id and name of patients
      const patientsIdandNames = []
      self.patientsList.forEach((patient: Patient) => {
        patientsIdandNames.push({label: patient.name, value: patient.id})
      })
      return patientsIdandNames
    },
    async getAppointments(token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.getAppointments("Bearer " + token)
      if (response.status === 200) {
        this.setErrorMessage("")
        this.setIsError(false)
        const appointments = response.data        
        const mappedAppointments = appointments.map(mapAppointment)
        self.setProp("appointmentsList", [])
        self.setProp("appointmentsList", mappedAppointments) 
        this.getPendingAppointments()
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async getPendingAppointments() {
      self.setProp("pendingAppointmentsList", [])
      const pendingAppointments = self.appointmentsList.filter((appointment: Appointment) => appointment.done === 0)
      // @ts-ignore
      self.setProp("pendingAppointmentsList", pendingAppointments)
      console.log("Se han cargado las citas pendientes")
    },
    async addAppointment(patient_id: number, date: string, time: string, comment: string, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.addAppointment("Bearer " + token, patient_id, date, time, comment)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const appointments = response.data        
        const mappedAppointments = appointments.map(mapAppointment)
        self.setProp("appointmentsList", [])
        self.setProp("appointmentsList", mappedAppointments)
        this.getPendingAppointments()
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async updateAppointment(id: number, patient_id: number, date: string, time: string, comment: string, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.updateAppointment("Bearer " + token, id, patient_id, date, time, comment)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const appointments = response.data        
        const mappedAppointments = appointments.map(mapAppointment)
        self.setProp("appointmentsList", [])
        self.setProp("appointmentsList", mappedAppointments)
        this.getPendingAppointments()
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async deleteAppointment(id: number, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.deleteAppointment("Bearer " + token, id)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const appointments = response.data        
        const mappedAppointments = appointments.map(mapAppointment)
        self.setProp("appointmentsList", [])
        self.setProp("appointmentsList", mappedAppointments)
        this.getPendingAppointments()
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
      }
      //delay
      setTimeout(() => {
        this.setIsLoading(false)
      }, 500)
    },
    async updateStateAppointment(id: number, done: number, token: string) {
      this.setIsLoading(true)
      const response = await MedicApiService.updateStateAppointment("Bearer " + token, id, done)
      if (response.status === 200) {
        this.setErrorMessage(response.message)
        this.setIsError(false)
        const appointments = response.data        
        const mappedAppointments = appointments.map(mapAppointment)
        self.setProp("appointmentsList", [])
        self.setProp("appointmentsList", mappedAppointments)
        this.getPendingAppointments()
      }else{
        if(response.status === 422){
          this.setIsError(true);
          this.setErrorMessage(response.data.message);
        }else{
          this.setIsError(true);
          this.setErrorMessage("Ha ocurrido un error inesperado");
        }
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
