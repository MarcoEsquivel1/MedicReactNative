import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { DatePickerInput } from 'react-native-paper-dates'
import { AppContext } from '../context/AppContextProvider.js'
import {
  en,
  nl,
  de,
  pl,
  pt,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import Animated, { FlipInYRight, ZoomIn, ZoomOut } from "react-native-reanimated"
registerTranslation('en', en)
registerTranslation('nl', nl)
registerTranslation('pl', pl)
registerTranslation('pt', pt)
registerTranslation('de', de)
registerTranslation('en-GB', enGB)

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const PatientDetailScreen: FC<StackScreenProps<AppStackScreenProps, "PatientDetail">> = observer(function PatientDetailScreen(props) {
  const { patient } = props.route.params
  const { doctorStore, authStore, themeStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)
  const [name, setName] = useState("")
  const [emptyName, setEmptyName] = useState(false)
  const [DNI, setDNI] = useState("")
  const [emptyDNI, setEmptyDNI] = useState(false)
  const [tel, setTel] = useState("")
  const [emptyTel, setEmptyTel] = useState(false)
  const [inputDate, setInputDate] = React.useState<Date | null>(null);
  const [emptyDate, setEmptyDate] = useState(false)
  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  useEffect(() => {
    setIsLoading(true)
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    setName(patient.getName)
    setDNI(patient.getDni)
    setTel(patient.getPhone)
    if (patient.getBirthday != null) {
      setInputDate(new Date(patient.getBirthday))
    } else {
      setInputDate(null)
    }
    setIsLoading(false)
  }, []);

  useEffect(() => {
    setError(doctorStore.getIsError)
    setErrorMessage(doctorStore.getErrorMessage)
  }, [doctorStore.isError, doctorStore.errorMessage]);

  const handleSubmmit = () => {
    if (name === "") {
      setEmptyName(true)
    } else {
      setEmptyName(false)
    }
    if (DNI === "") {
      setEmptyDNI(true)
    } else {
      setEmptyDNI(false)
    }
    if (tel === "") {
      setEmptyTel(true)
    } else {
      setEmptyTel(false)
    }
    if (inputDate === null) {
      setEmptyDate(true)
    } else {
      setEmptyDate(false)
    }
    if (name !== "" && DNI !== "" && tel !== "" && inputDate !== null) {
      const token = authStore.getAuthToken
      doctorStore.updatePatient(patient.id, name, DNI, tel, inputDate.toLocaleDateString("sv"), token)
      /* props.navigation.goBack() */
    }
  }

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
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
      <StatusBar backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView behavior={'height'} enabled style={$mainContainer}>
        <Animated.View
          entering={ZoomIn.delay(100)}
          exiting={ZoomOut}
        >
          <Text variant="displayMedium" className="text-center" style={$mainTitle}>Editar Paciente</Text>
        </Animated.View>
        <Animated.View
          entering={ZoomIn.delay(200)}
          exiting={ZoomOut}
        >
          <TextInput label="Nombre" value={name} onChangeText={setName} mode="outlined" style={{ marginVertical: 10 }} error={emptyName} />
        </Animated.View>
        <Animated.View
          entering={ZoomIn.delay(200)}
          exiting={ZoomOut}
        >

          <TextInput label="DNI" value={DNI} onChangeText={setDNI} mode="outlined" style={{ marginVertical: 10 }} error={emptyDNI} />
        </Animated.View>
        <Animated.View
          entering={ZoomIn.delay(200)}
          exiting={ZoomOut}
        >
          <TextInput label="Tel" value={tel} onChangeText={setTel} mode="outlined" style={{ marginVertical: 10 }} error={emptyTel} />
        </Animated.View>
        <Animated.View
          entering={ZoomIn.delay(200)}
          exiting={ZoomOut}
        >
          <View style={{ marginVertical: 10 }}>
            <DatePickerInput
              locale="sv"
              label="Birthdate"
              value={inputDate}
              mode="outlined"
              onChange={(d) => setInputDate(d)}
              inputMode="start"
              withModal={false}
              style={{ display: "flex", marginVertical: 10 }}
            // other react native TextInput props             
            />
          </View>
        </Animated.View>
        <Text variant="labelLarge" className="text-left my-1" style={{ color: error ? theme.colors.error : theme.colors.primary }}>{errorMessage}</Text>
        <Animated.View
          entering={FlipInYRight.delay(200)}
          exiting={ZoomOut}
        >
          <Button mode="contained" onPress={() => {
            handleSubmmit()
          }} style={{ marginVertical: 20 }}>
            Actualizar <MaterialCommunityIcons name="upload" size={16} color={theme.colors.background} />
          </Button>
        </Animated.View>
        <Animated.View
          entering={FlipInYRight.delay(200)}
          exiting={ZoomOut}
        >
          <Button mode="contained" onPress={() => {
            props.navigation.goBack()
            doctorStore.setIsError(false)
            doctorStore.setErrorMessage("")
          }} style={{ marginVertical: 10, backgroundColor: theme.colors.error }}>
            Regresar <MaterialCommunityIcons name="arrow-left" size={16} color={theme.colors.background} />
          </Button>
        </Animated.View>
      </KeyboardAvoidingView>


    </Screen>
  )
})


