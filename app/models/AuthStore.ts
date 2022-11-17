import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import MedicApiService from "../services/MedicAPI"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    isError: types.optional(types.boolean, false),
    errorMessage: types.optional(types.string, ""),
    isLoading: types.optional(types.boolean, false),
    authToken: types.maybe(types.string),
    authUsername: types.optional(types.string, ""),
    authEmail: types.optional(types.string, ""), 
    authPassword: types.optional(types.string, ""),
    authPasswordConfirm: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get isAuthenticated() {
      return !!self.authToken
    },
    get getIsLoading() {
      return self.isLoading
    },
    get getIsError() {
      return self.isError
    },
    get getAuthToken() {
      return self.authToken
    },
    get getErrorMessage() {
      return self.errorMessage
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setAuthUsername: (username: string) => {
      self.authUsername = username
    },
    setAuthEmail: (email: string) => {
      self.authEmail = email
    },
    setAuthPassword: (password: string) => {
      self.authPassword = password
    },
    setAuthPasswordConfirm: (passwordConfirm: string) => {
      self.authPasswordConfirm = passwordConfirm
    },
    setToken: (token: string) => {
      self.authToken = token
    },
    async logout() {
      const response = await MedicApiService.logout("Bearer " + self.authToken)
      if (response.status === 200) {
        this.setToken("")
        this.setAuthEmail("")
        this.setAuthUsername("")
        this.setAuthPassword("")
        this.setAuthPasswordConfirm("")
        this.setErrorMessage("")
        this.setIsError(false)
      }else{
        console.log(response.message)
      }
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
    async login() {
      this.setIsLoading(true)
      const response = await MedicApiService.login(self.authUsername, self.authPassword);
      if (response.status === 200) {
        console.log(response.data.access_token);
        this.setToken(response.data.access_token);
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
    async register() {
      this.setIsLoading(true)
      const response = await MedicApiService.register(self.authUsername, self.authEmail, self.authPassword, self.authPasswordConfirm);
      if (response.status === 200) {
        this.setErrorMessage(response.message);
        this.setIsError(false);
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
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
