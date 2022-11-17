import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { themeLight, themeDark } from "../theme/themeColors"

/**
 * Model description here for TypeScript hints.
 */
export const ThemeStoreModel = types
  .model("ThemeStore")
  .props({
    //theme can be themeLight or themeDark
    theme: types.optional(types.frozen(), themeLight),
    themeColor: types.optional(types.string, "light"),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get getIsDark() {
      return self.themeColor === "dark"
    },
    get getIsLight() {
      return self.themeColor === "light"
    },
    get getTheme() {
      return self.theme
    },
    get getThemeColor() {
      return self.themeColor
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    toggleTheme() {
      if (self.themeColor === "light") {
        self.themeColor = "dark"
        self.theme = themeDark
      } else {
        self.themeColor = "light"
        self.theme = themeLight
      }
    },
    setDarkTheme() {
      self.themeColor = "dark"
      self.theme = themeDark
    },
    setLightTheme() {
      self.themeColor = "light"
      self.theme = themeLight
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ThemeStore extends Instance<typeof ThemeStoreModel> {}
export interface ThemeStoreSnapshotOut extends SnapshotOut<typeof ThemeStoreModel> {}
export interface ThemeStoreSnapshotIn extends SnapshotIn<typeof ThemeStoreModel> {}
export const createThemeStoreDefaultModel = () => types.optional(ThemeStoreModel, {})
