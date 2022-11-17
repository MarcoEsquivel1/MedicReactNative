import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthStoreModel } from "./AuthStore"
import { DoctorStoreModel } from "./DoctorStore"
import { ThemeStoreModel } from "./ThemeStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    authStore: types.optional(AuthStoreModel, {} as any),
    doctorStore: types.optional(DoctorStoreModel, {} as any),
    themeStore: types.optional(ThemeStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
