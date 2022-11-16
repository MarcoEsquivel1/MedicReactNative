/**
 * Welcome to the main entry point of the app. In this file, we'll
 * be kicking off our app.
 *
 * Most of this file is boilerplate and you shouldn't need to modify
 * it very often. But take some time to look through and understand
 * what is going on here.
 *
 * The app navigation resides in ./app/navigators, so head over there
 * if you're interested in adding screens and navigators.
 */
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import { useInitialRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import { setupReactotron } from "./services/reactotron"
import Config from "./config"
import { TailwindProvider } from 'tailwindcss-react-native';
import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DefaultDarkTheme, Provider as PaperProvider } from 'react-native-paper';
// Set up Reactotron, which is a free desktop app for inspecting and debugging
// React Native apps. Learn more here: https://github.com/infinitered/reactotron
setupReactotron({
  // clear the Reactotron window when the app loads/reloads
  clearOnLoad: true,
  // generally going to be localhost
  host: "localhost",
  // Reactotron can monitor AsyncStorage for you
  useAsyncStorage: true,
  // log the initial restored state from AsyncStorage
  logInitialState: true,
  // log out any snapshots as they happen (this is useful for debugging but slow)
  logSnapshots: false,
})

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

interface AppProps {
  hideSplashScreen: () => Promise<void>
}

/**
 * This is the root component of our app.
 */
function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  })

  // Before we show the app, we have to wait for our state to be ready.
  // In the meantime, don't render anything. This will be the background
  // color set in native by rootView's background color.
  // In iOS: application:didFinishLaunchingWithOptions:
  // In Android: https://stackoverflow.com/a/45838109/204044
  // You can replace with your own loading component if you wish.
  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const themeLight = {
    ...DefaultTheme,
    "colors": {
      "primary": "rgb(0, 102, 132)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(190, 233, 255)",
      "onPrimaryContainer": "rgb(0, 31, 42)",
      "secondary": "rgb(77, 97, 108)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(208, 230, 242)",
      "onSecondaryContainer": "rgb(8, 30, 39)",
      "tertiary": "rgb(93, 91, 125)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(227, 223, 255)",
      "onTertiaryContainer": "rgb(26, 24, 54)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(251, 252, 254)",
      "onBackground": "rgb(25, 28, 30)",
      "surface": "rgb(251, 252, 254)",
      "onSurface": "rgb(25, 28, 30)",
      "surfaceVariant": "rgb(220, 228, 233)",
      "onSurfaceVariant": "rgb(64, 72, 76)",
      "outline": "rgb(112, 120, 125)",
      "outlineVariant": "rgb(192, 200, 205)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(46, 49, 51)",
      "inverseOnSurface": "rgb(239, 241, 243)",
      "inversePrimary": "rgb(104, 211, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(238, 245, 248)",
        "level2": "rgb(231, 240, 244)",
        "level3": "rgb(223, 236, 241)",
        "level4": "rgb(221, 234, 239)",
        "level5": "rgb(216, 231, 237)"
      },
      "surfaceDisabled": "rgba(25, 28, 30, 0.12)",
      "onSurfaceDisabled": "rgba(25, 28, 30, 0.38)",
      "backdrop": "rgba(42, 49, 54, 0.4)"
    }
  };

  const themeDark = {
    ...DefaultDarkTheme,
    "colors": {
      "primary": "rgb(104, 211, 255)",
      "onPrimary": "rgb(0, 53, 70)",
      "primaryContainer": "rgb(0, 77, 100)",
      "onPrimaryContainer": "rgb(190, 233, 255)",
      "secondary": "rgb(180, 202, 214)",
      "onSecondary": "rgb(31, 51, 60)",
      "secondaryContainer": "rgb(53, 74, 84)",
      "onSecondaryContainer": "rgb(208, 230, 242)",
      "tertiary": "rgb(198, 194, 234)",
      "onTertiary": "rgb(47, 45, 77)",
      "tertiaryContainer": "rgb(69, 67, 100)",
      "onTertiaryContainer": "rgb(227, 223, 255)",
      "error": "rgb(255, 180, 171)",
      "onError": "rgb(105, 0, 5)",
      "errorContainer": "rgb(147, 0, 10)",
      "onErrorContainer": "rgb(255, 180, 171)",
      "background": "rgb(25, 28, 30)",
      "onBackground": "rgb(225, 226, 228)",
      "surface": "rgb(25, 28, 30)",
      "onSurface": "rgb(225, 226, 228)",
      "surfaceVariant": "rgb(64, 72, 76)",
      "onSurfaceVariant": "rgb(192, 200, 205)",
      "outline": "rgb(138, 146, 151)",
      "outlineVariant": "rgb(64, 72, 76)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(225, 226, 228)",
      "inverseOnSurface": "rgb(46, 49, 51)",
      "inversePrimary": "rgb(0, 102, 132)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(29, 37, 41)",
        "level2": "rgb(31, 43, 48)",
        "level3": "rgb(34, 48, 55)",
        "level4": "rgb(35, 50, 57)",
        "level5": "rgb(36, 54, 62)"
      },
      "surfaceDisabled": "rgba(225, 226, 228, 0.12)",
      "onSurfaceDisabled": "rgba(225, 226, 228, 0.38)",
      "backdrop": "rgba(42, 49, 54, 0.4)"
    }
  };


  // otherwise, we're ready to render the app
  return (
    <TailwindProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <PaperProvider theme={themeLight}>
          <ErrorBoundary catchErrors={Config.catchErrors}>
            <AppNavigator
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </ErrorBoundary>
        </PaperProvider>
      </SafeAreaProvider>
    </TailwindProvider>
  )
}

export default App
