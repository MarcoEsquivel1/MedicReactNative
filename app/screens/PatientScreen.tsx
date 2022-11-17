import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView, TouchableOpacity, } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput, useTheme, ToggleButton } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { TimePickerModal } from 'react-native-paper-dates'
import { AppContext } from '../context/AppContextProvider.js'


// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const PatientScreen: FC<StackScreenProps<AppStackScreenProps, "Patient">> = observer(function PatientScreen(props) {
  const { navigation } = props;
  const { authStore, doctorStore, themeStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)

  const handleThemeChange = () => {
    themeStore.toggleTheme()
  }

  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  useEffect(() => {
    setIsLoading(doctorStore.getIsLoading)
  }, [doctorStore.isLoading])

  useEffect(() => {
    setError(doctorStore.getIsError)
    setErrorMessage(doctorStore.getErrorMessage)
  }, [doctorStore.isError, doctorStore.errorMessage]);

  useEffect(() => {
    doctorStore.setIsLoading(false)
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    const token = authStore.getAuthToken
    doctorStore.getPatients(token)
  }, []);

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
    justifyContent: "flex-start",  
    paddingTop: 20, 
  }

  const $mainTitle: TextStyle = {
    color: theme.colors.onBackground,
    marginBottom: 10,
  } 

  const $card: ViewStyle = {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 20,
    padding: 10,
  }

  const $cardText: TextStyle = {
    color: theme.colors.surface,
  }

  const $deleteButton: ViewStyle = {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 20,
    borderBottomEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 5,
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  }

  const $horasItem: ViewStyle = {
    backgroundColor: theme.colors.errorContainer,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  }

  if(isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background}}>
        <ActivityIndicator animating={true} color={MD2Colors.purple700} />
        <Text>Cargando...</Text>
      </View>
    )
  }

  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >
      <StatusBar backgroundColor={theme.colors.background}/>
      <View style={$mainContainer}>
        <View style={{position: "absolute", top: 0, right: 0, padding: 5}}>
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.colors.background} />}
            value="theme"
            style={{backgroundColor: theme.colors.primaryContainer, zIndex: 100}}
            onPress={handleThemeChange}
          />
        </View>
        <Text variant="displayLarge" className="text-center font-bold" style={$mainTitle}>Pacientes</Text>
        <View style={$card}>
          <View style={{position: "absolute", top: 0, right: 0, padding: 0}}>
            <TouchableOpacity onPress={() => {}} style={$deleteButton}>
              <MaterialCommunityIcons name="trash-can-outline" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <View className="w-9/12">
            <Text variant="headlineSmall" style={$cardText}>Nombre del paciente </Text>
          </View>
          <View className="flex flex-row justify-between">
            <View className="w-1/2 items-center justify-center">
              <MaterialCommunityIcons name="account-outline" size={120} color={$cardText.color} />
            </View>
            <View className="w-1/2 items-center justify-center">
              <View className="" style={$horasItem}>
                <Text variant="labelLarge" style={$cardText}>Check-in: 08:00 </Text>
              </View>
              <View className="" style={$horasItem}>
                <Text variant="labelLarge" style={$cardText}>Check-out: 14:00</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

    </Screen>
  )
})

