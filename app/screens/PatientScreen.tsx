import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView, TouchableOpacity, } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput, ToggleButton, Modal, Portal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates'
import { AppContext } from '../context/AppContextProvider.js'
import { PatientCard } from "../components/PatientCard"
import { FlatList } from "react-native-gesture-handler"
import { Patient } from "../models/Patient"
import {
  en,
  nl,
  de,
  pl,
  pt,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"
registerTranslation('en', en)
registerTranslation('nl', nl)
registerTranslation('pl', pl)
registerTranslation('pt', pt)
registerTranslation('de', de)
registerTranslation('en-GB', enGB)

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const PatientScreen: FC<StackScreenProps<AppStackScreenProps, "Patient">> = observer(function PatientScreen(props) {
  const { navigation } = props;
  const { authStore, doctorStore, themeStore } = useStores()
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
  const [visible, setVisible] = React.useState(false);
  const [visibleDelete, setVisibleDelete] = React.useState(false);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)


  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const showModalDelete = () => setVisibleDelete(true);
  const hideModalDelete = () => setVisibleDelete(false);

  const handleAdd = () => {
    showModal()
  }

  const handleDelete = () => {
    console.log()
    showModalDelete()
  }

  const handleConfirmDelete = () => {
    if (selectedPatient) {
      const token = authStore.getAuthToken
      doctorStore.deletePatient(selectedPatient.id, token)
      hideModalDelete()
      setSelectedPatient(null)
    }
  }

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
      doctorStore.addPatient(name, DNI, tel, inputDate.toLocaleDateString("sv"), token)
      setName("")
      setDNI("")
      setTel("")
      setInputDate(null)
    }
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
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    setErrorMessage(doctorStore.getErrorMessage)
    setError(doctorStore.getIsError)
    setEmptyDNI(false)
    setEmptyName(false)
    setEmptyTel(false)
    setEmptyDate(false)
  }, [visible])

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
    paddingBottom: 15,
  }

  const $mainContainer: ViewStyle = {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingTop: 5,
  }

  const $mainTitle: TextStyle = {
    color: theme.colors.onBackground,
    marginBottom: 5,
  }

  const $modalStyle = {
    backgroundColor: theme.colors.background,
    padding: 20,
    zIndex: 100,
    marginHorizontal: 20,
    borderRadius: 5,
  };

  const $closeButton: ViewStyle = {
    backgroundColor: theme.colors.error,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
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
      <View style={$mainContainer}>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={$modalStyle}>
            <View style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, zIndex: 100 }}>
              <TouchableOpacity onPress={hideModal} style={$closeButton}>
                <MaterialCommunityIcons name="close" size={34} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={'height'} enabled>
              <Text variant="headlineMedium" className="mb-3">Agregar Paciente</Text>
              <Text variant="labelLarge" className="text-left mb-3" style={{ color: theme.colors.onSurface }}>{errorMessage}</Text>
              <TextInput label="Nombre" value={name} onChangeText={setName} mode="outlined" style={{ marginVertical: 10 }} error={emptyName} />
              <TextInput label="DNI" value={DNI} onChangeText={setDNI} mode="outlined" style={{ marginVertical: 10 }} error={emptyDNI} />
              <TextInput label="Tel" value={tel} onChangeText={setTel} mode="outlined" style={{ marginVertical: 10 }} error={emptyTel} />
              <DatePickerInput
                locale="sv"
                label="Birthdate"
                value={inputDate}
                mode="outlined"
                onChange={(d) => setInputDate(d)}
                inputMode="start"
                withModal={false}
              // other react native TextInput props             
              />
              <Text variant="labelSmall" style={{ marginTop: 10, color: theme.colors.error }}>{emptyDate ? "Debe ingresar una fecha de nacimiento" : ""}</Text>
              <Button mode="contained" onPress={() => {
                handleSubmmit()
              }} style={{ marginVertical: 20 }}>
                Agregar
              </Button>
            </KeyboardAvoidingView>
          </Modal>
        </Portal>
        <Portal>
          <Modal visible={visibleDelete} onDismiss={hideModalDelete} contentContainerStyle={$modalStyle}>
            <View style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, zIndex: 100 }}>
              <TouchableOpacity onPress={hideModalDelete} style={$closeButton}>
                <MaterialCommunityIcons name="close" size={34} color={theme.colors.surface} />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={'height'} enabled>
              <Text variant="headlineMedium" className="mb-3">Eliminar Paciente</Text>
              <Text variant="labelLarge" className="text-left my-1" style={{ color: theme.colors.onSurface }}>¿Está seguro que desea eliminar al paciente {selectedPatient?.getName}?</Text>

              <Button mode="contained" onPress={() => {
                handleConfirmDelete()
              }} style={{ marginVertical: 20 }}>
                Eliminar
              </Button>
            </KeyboardAvoidingView>
          </Modal>
        </Portal>
        <View style={{ position: "absolute", top: 0, right: 0, padding: 5 }}>
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="plus" size={24} color={theme.colors.background} />}
            value="theme"
            style={{ backgroundColor: theme.colors.secondary, zIndex: 100, marginTop: 5 }}
            onPress={handleAdd}
          />
        </View>
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <Text variant="displayMedium" className="text-center font-bold" style={$mainTitle}>Pacientes</Text>
        </Animated.View>
        <Text variant="labelLarge" className="text-left mb-4" style={{ color: theme.colors.onSurface }}>{errorMessage}</Text>
        <FlatList<Patient>
          style={{ flex: 1, width: "100%" }}
          data={doctorStore.getPatientsList}
          contentContainerStyle={{ paddingBottom: 5 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1, width: "100%", marginBottom: 15 }}>
              <PatientCard patient={item} index={index} onDelete={handleDelete} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
            </View>
          )}
        />
      </View>

    </Screen>
  )
})

