import { observer } from "mobx-react-lite"
import React, {
  FC, useContext, useEffect,
} from "react"
import { TextStyle, View, ViewStyle, StatusBar } from "react-native"
import { Screen } from "../components"
import { Button, Text, ToggleButton } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { AppContext } from '../context/AppContextProvider.js'
// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const WelcomeScreen: FC<StackScreenProps<WelcomeScreenProps, "Welcome">> = observer(function WelcomeScreen(props) {
  const { navigation } = props;

  const { authStore, doctorStore, themeStore } = useStores()

  const handleThemeChange = () => {
    themeStore.toggleTheme()
  }
  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  const $root: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  }

  const $screenContentContainer: ViewStyle = {
    flex: 1,
    paddingBottom: 50,
  }

  const $mainContainer: ViewStyle = {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  }

  const $mainTitle: TextStyle = {
    color: theme.colors.primary,
  }


  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >
      <StatusBar backgroundColor={theme.colors.background} />
      <View style={$mainContainer}>
        <View style={{ position: "absolute", top: 0, right: 0, padding: 10 }}>
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.colors.background} />}
            value="theme"
            style={{ backgroundColor: theme.colors.primary }}
            onPress={handleThemeChange}
          />
        </View>
        <Text variant="displayLarge" className="text-center mb-5" style={$mainTitle}>Home</Text>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Doctor")
        }}
          style={{ marginVertical: 10 }}>
          Ver Perfil <MaterialCommunityIcons name="medical-bag" size={16} color={theme.colors.background} />
        </Button>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Patient")
        }}
          style={{ marginVertical: 10, backgroundColor: theme.colors.secondary }}>
          Ver Pacientes <MaterialCommunityIcons name="account-multiple" size={16} color={theme.colors.background} />
        </Button>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Appointment")
        }}
          style={{ marginVertical: 10, backgroundColor: theme.colors.secondary }}>
          Ver Citas <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.background} />
        </Button>
        <Button mode="contained" onPress={() => {
          doctorStore.clearDoctor()
          authStore.logout()
        }}
          style={{ marginVertical: 10, backgroundColor: theme.colors.error }}>
          Cerrar Sesión <MaterialCommunityIcons name="login" size={16} color={theme.colors.background} />
        </Button>
      </View>


    </Screen>
  )
})