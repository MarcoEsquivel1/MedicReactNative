/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StackScreenProps, TransitionPresets } from "@react-navigation/stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"
import Config from "../config"
import { useStores } from "../models"
import {
  WelcomeScreen,
} from "../screens"
import { DoctorScreen } from "../screens/DoctorScreen"
import { LoginScreen } from "../screens/LoginScreen"
import { RegisterScreen } from "../screens/RegisterScreen"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import {AppContextProvider} from "../context/AppContextProvider.js"
import { PatientScreen } from "../screens/PatientScreen"
import { Patient } from "../models/Patient"
import { PatientDetailScreen } from "../screens/PatientDetailScreen"
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined,
  Login: undefined,
  Register: undefined,
  Doctor: undefined,
  Patient: undefined,
  PatientDetail: {
    patient: Patient
  }
  // 🔥 Your screens go here
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = StackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createStackNavigator<AppStackParamList>()



const AppStack = observer(function AppStack() {
  const {authStore} = useStores()
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, ...TransitionPresets.ModalPresentationIOS, gestureEnabled: true }}
      initialRouteName={authStore.isAuthenticated ? "Welcome" : "Login"}
      
    >
      {authStore.isAuthenticated ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Doctor" component={DoctorScreen} />
          <Stack.Screen name="Patient" component={PatientScreen} options={{...TransitionPresets.SlideFromRightIOS, gestureEnabled: true, gestureDirection: "horizontal"}}/>
          <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
      {/* @demo remove-block-end */}
      {/** 🔥 Your screens go here */}
    </Stack.Navigator>
  )
})

interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const { themeStore } = useStores()
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (colorScheme === "dark") {
      themeStore.setDarkTheme()
    } else {
      themeStore.setLightTheme()
    }
  }, [colorScheme])



  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <AppContextProvider>
      <NavigationContainer
        ref={navigationRef}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        {...props}
      >
        <AppStack />
      </NavigationContainer>
    </AppContextProvider>
  )
})
