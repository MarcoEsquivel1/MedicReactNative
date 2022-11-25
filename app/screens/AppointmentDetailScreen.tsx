import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput, useTheme, ToggleButton } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { DatePickerInput, TimePickerModal } from 'react-native-paper-dates'
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
import DropDown from "react-native-paper-dropdown"
import { Appointment } from "../models/Appointment"
import { setDate } from "date-fns"
registerTranslation('en', en)
registerTranslation('nl', nl)
registerTranslation('pl', pl)
registerTranslation('pt', pt)
registerTranslation('de', de)
registerTranslation('en-GB', enGB)

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const AppointmentDetailScreen: FC<StackScreenProps<AppStackScreenProps, "AppointmentDetail">> = observer(function AppointmentDetailScreen(props) {
  const { appointment } = props.route.params
  const { doctorStore, authStore, themeStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)
  const [showDropDown, setShowDropDown] = useState(false);
  const [patient, setPatient] = useState(null);
  const [patientList, setPatientList] = useState([]);
  const [emptyPatient, setEmptyPatient] = useState(false);
  const [inputDate, setInputDate] = React.useState<Date | null>(null);
  const [emptyDate, setEmptyDate] = useState(false)
  const [time, setTime] = useState(null)
  const [emptyTime, setEmptyTime] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [comment, setComment] = useState("")
  const [emptyComment, setEmptyComment] = useState(false)
  const [errorEmpty, setErrorEmpty] = useState(false)
  const [errorEmptyMessage, setErrorEmptyMessage] = useState("")

  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  useEffect(() => {
    setPatientList(doctorStore.getPatientsIdandNames)
    setIsLoading(true)
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    setPatient(appointment.getPatientId)
    setTime(appointment.getTime)
    setComment(appointment.getComment)
    if (appointment.getDate != null) {
      setInputDate(new Date(appointment.getDate))
    }else{
      setInputDate(null)
    }
    setIsLoading(false)
  }, []);

  useEffect(() => {
    setError(doctorStore.getIsError)
    setErrorMessage(doctorStore.getErrorMessage)
  }, [doctorStore.isError, doctorStore.errorMessage]);

  const handleSubmmit = () => {
    if (patient == null) {
      setEmptyPatient(true)
    }else{
      setEmptyPatient(false)
    }
    if (inputDate == null) {
      setEmptyDate(true)
    }else{
      setEmptyDate(false)
    }
    if (time == null) {
      setEmptyTime(true)
    }else{
      setEmptyTime(false)
    }
    if (comment == "") {
      setEmptyComment(true)
    }else{
      setEmptyComment(false)
    }
    if (patient != null && inputDate != null && time != null && comment != "") {
      setErrorEmpty(false)
      setErrorEmptyMessage("")
      const token = authStore.getAuthToken
      doctorStore.updateAppointment(appointment.getId ,patient, inputDate.toLocaleDateString("sv"), time, comment, token)
      setErrorMessage(doctorStore.getErrorMessage)
      setError(doctorStore.getIsError)
      setErrorEmpty(false)
      setErrorEmptyMessage("")
    }else{
      setErrorEmpty(true)
      setErrorEmptyMessage("Por favor, llene todos los campos")
    }
  }

  const onDismiss1 = React.useCallback(() => {
    setVisible1(false)
  }, [setVisible1])

  const onConfirm1 = React.useCallback(
    ({ hours, minutes }) => {
      setVisible1(false);
      if(minutes >= 10 && hours >= 10){
        setTime(`${hours}:${minutes}`)
      }else if(minutes < 10 && hours >= 10){
        setTime(`${hours}:0${minutes}`)
      }else if(minutes >= 10 && hours < 10){
        setTime(`0${hours}:${minutes}`)
      }else{
        setTime(`0${hours}:0${minutes}`)
      }
    },
    [setVisible1]
  );

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
      <KeyboardAvoidingView behavior={'height'} enabled style={$mainContainer}>
      <TimePickerModal
        // @ts-ignore
        clockIcon={() => <MaterialCommunityIcons name="clock" size={24} color={theme.colors.onBackground}/>}
        // @ts-ignore
        keyboardIcon={() => <MaterialCommunityIcons name="keyboard" size={24} color={theme.colors.onBackground}/>}
        visible={visible1}
        onDismiss={onDismiss1}
        onConfirm={onConfirm1}
        hours={9} // default: current hours
        minutes={0} // default: current minutes
        label="Hora de la cita" // optional, default 'Select time'
        uppercase={false} // optional, default is true
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale="fr" // optional, default is automically detected by your system
        // keyboardIcon="keyboard-outline" // optional, default is "keyboard-outline"
        // clockIcon="clock-outline" // optional, default is "clock-outline"
      /> 
      <Text variant="displayMedium" className="text-center" style={$mainTitle}>Editar Cita</Text>
      <DropDown
              label={"Paciente"}
              mode={"outlined"}
              visible={showDropDown}
              showDropDown={() => setShowDropDown(true)}
              onDismiss={() => setShowDropDown(false)}
              value={patient}
              setValue={setPatient}
              list={patientList}
            />
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <TextInput label="Hora de la cita" value={time} onChangeText={setTime} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.background, width: "70%"}} error={emptyTime} disabled/>
              <Button mode="contained" onPress={() => setVisible1(true)} style={{width: "23%", height: 40, padding: 0, itemsAlign: "center", justifyContent: "center", backgroundColor: theme.colors.primary, marginVertical: 10}}><MaterialCommunityIcons name="clock-outline" size={20} color= {theme.colors.background} /></Button>
            </View>

            <View style={{marginVertical: 10}}>
              <DatePickerInput
                locale="sv"
                label="Birthdate"
                value={inputDate}
                mode="outlined"
                onChange={(d) => setInputDate(d)}
                inputMode="start"
                withModal={false}
                style={{display: "flex", marginVertical: 10}}
                // other react native TextInput props             
              />
            </View>

            <TextInput 
              label="Comentario" 
              value={comment} 
              onChangeText={setComment} 
              mode="outlined" 
              style={{marginVertical: 10, backgroundColor: theme.colors.background}} 
              error={emptyComment} 
              multiline={true} 
              numberOfLines={4} 
            />

            <Text variant="labelLarge" className="text-left mb-3" style={{color: theme.colors.error}}>{errorEmpty ? errorEmptyMessage : ""}</Text>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? theme.colors.error : theme.colors.primary}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleSubmmit()
        }} style={{marginVertical: 20}}>
          Actualizar <MaterialCommunityIcons name="upload" size={16} color= {theme.colors.background} />
        </Button>
        <Button mode="contained" onPress={() => {
          props.navigation.goBack()
          doctorStore.setIsError(false)
          doctorStore.setErrorMessage("")
        }} style={{marginVertical: 10, backgroundColor: theme.colors.error}}>
          Regresar <MaterialCommunityIcons name="arrow-left" size={16} color= {theme.colors.background} />
        </Button>
      </KeyboardAvoidingView>
      

    </Screen>
  )
})