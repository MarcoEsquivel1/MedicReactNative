import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView, TouchableOpacity, } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput, useTheme, ToggleButton, Modal, Portal } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates'
import { AppContext } from '../context/AppContextProvider.js'
import { PatientCard } from "../components/PatientCard"
import { FlatList } from "react-native-gesture-handler"
import { Patient } from "../models/Patient"
import { DatePickerModal } from 'react-native-paper-dates';
import {
  en,
  nl,
  de,
  pl,
  pt,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
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
  const [inputDate, setInputDate] = React.useState(new Date('2020-01-01T00:00:00.000Z'));

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleAdd = () => {
    showModal()
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
    paddingTop: 5, 
  }

  const $mainTitle: TextStyle = {
    color: theme.colors.onBackground,
    marginBottom: 20,
  } 

  const $modalStyle = {
    backgroundColor: theme.colors.background,
    padding: 20, 
    zIndex: 100,
    marginHorizontal: 20,
    borderRadius: 5,
  };

  const $closeButton: ViewStyle = {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
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
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={$modalStyle}>
          <View style={{position: "absolute", top: 0, right: 0, width: 50, height: 50, zIndex: 100}}>
            <TouchableOpacity onPress={hideModal} style={$closeButton}>
              <MaterialCommunityIcons name="close" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={'height'} enabled>
            <Text variant="headlineMedium" className="mb-3">Agregar Paciente</Text>
            <TextInput label="Nombre" value={name} onChangeText={setName} mode="outlined" style={{marginVertical: 10}} error={emptyName}/>
            <TextInput label="DNI" value={DNI} onChangeText={setDNI} mode="outlined" style={{marginVertical: 10}} error={emptyDNI}/>
            <TextInput label="Tel" value={tel} onChangeText={setTel} mode="outlined" style={{marginVertical: 10}} error={emptyTel}/>
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
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
        <View style={{position: "absolute", top: 0, right: 0, padding: 5}}>
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="plus" size={24} color={theme.colors.background} />}
            value="theme"
            style={{backgroundColor: theme.colors.primaryContainer, zIndex: 100, marginTop: 5}}
            onPress={handleAdd}
          />
        </View>
        <Text variant="displayMedium" className="text-center font-bold" style={$mainTitle}>Pacientes</Text>
        
        <FlatList<Patient>
          style={{flex: 1, width: "100%"}}
          data={doctorStore.getPatientsList}
          contentContainerStyle={{paddingBottom: 20}}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <View style={{flex: 1, width: "100%", marginBottom: 15}}>
              <PatientCard patient={item} />
            </View>
          )}
        />
      </View>

    </Screen>
  )
})

