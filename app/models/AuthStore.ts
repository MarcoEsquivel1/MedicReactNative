import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import MedicApiService from "../services/MedicAPI"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model("AuthStore")
  .props({
    authToken: types.maybe(types.string),
    authUsername: types.optional(types.string, ""), 
    authPassword: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get isAuthenticated() {
      return !!self.authToken
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setAuthUsername: (username: string) => {
      self.authUsername = username
    },
    setAuthPassword: (password: string) => {
      self.authPassword = password
    },
    async login() {
      const response = await MedicApiService.login(self.authUsername, self.authPassword);
      if (response.status === 200) {
        self.authToken = response.data.access_token;
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AuthStore extends Instance<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotOut extends SnapshotOut<typeof AuthStoreModel> {}
export interface AuthStoreSnapshotIn extends SnapshotIn<typeof AuthStoreModel> {}
export const createAuthStoreDefaultModel = () => types.optional(AuthStoreModel, {})
