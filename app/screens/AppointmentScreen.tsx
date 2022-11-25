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
import { FlatList } from "react-native-gesture-handler"
import {
  en,
  nl,
  de,
  pl,
  pt,
  enGB,
  registerTranslation,
} from 'react-native-paper-dates'
import { AppointmentCard } from "../components/AppointmentCard"
import { Appointment } from "../models/Appointment"
import DropDown from "react-native-paper-dropdown";
registerTranslation('en', en)
registerTranslation('nl', nl)
registerTranslation('pl', pl)
registerTranslation('pt', pt)
registerTranslation('de', de)
registerTranslation('en-GB', enGB)


// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const AppointmentScreen: FC<StackScreenProps<AppStackScreenProps, "Appointment">> = observer(function AppointmentScreen(props) {
  const { navigation } = props;
  const { authStore, doctorStore, themeStore } = useStores()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [error, setError] = useState(false)
  const [visible, setVisible] = React.useState(false);
  const [visibleDelete, setVisibleDelete] = React.useState(false);
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [pending, setPending] = useState(false)
  
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
    if(selectedAppointment != null){
      const token = authStore.getAuthToken
      setPending(false)
      doctorStore.deleteAppointment(selectedAppointment.id, token)
      hideModalDelete()
      setSelectedAppointment(null)
    }
  }

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
      setPending(false)
      const token = authStore.getAuthToken
      doctorStore.addAppointment(patient, inputDate.toLocaleDateString("sv"), time, comment, token)
      setErrorMessage(doctorStore.getErrorMessage)
      setError(doctorStore.getIsError)
      setPatient(null);
      setInputDate(null);
      setTime(null);
      setComment("");
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
    setPatient(null);
    setInputDate(null);
    setTime(null);
    setComment("");
    setErrorEmpty(false)
    setErrorEmptyMessage("")
  }, [visible])

  useEffect(() => {
    doctorStore.setIsLoading(false)
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    const token = authStore.getAuthToken
    doctorStore.getPatients(token)
    doctorStore.getAppointments(token)
    setPatientList(doctorStore.getPatientsIdandNames)
  }, []);

  useEffect(() => {
    doctorStore.getPendingAppointments()
  }, [doctorStore.getAppointmentsList])

  useEffect(() => {
    console.log(doctorStore.getPendingAppointmentsList)
  }, [doctorStore.pendingAppointmentsList])

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
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={$modalStyle}>
          <View style={{position: "absolute", top: 0, right: 0, width: 50, height: 50, zIndex: 100}}>
            <TouchableOpacity onPress={hideModal} style={$closeButton}>
              <MaterialCommunityIcons name="close" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={'height'} enabled>
            <Text variant="headlineMedium" className="mb-3">Agregar Cita</Text>
            <Text variant="labelLarge" className="text-left mb-3" style={{color: theme.colors.onSurface}}>{errorMessage}</Text>
            {/* Contenido add */}
            
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

            <DatePickerInput
              locale="sv"
              label="Fecha"
              value={inputDate}
              mode="outlined"
              onChange={(d) => setInputDate(d)}
              inputMode="start"
              withModal={false}
              // other react native TextInput props             
            />

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

            <Button mode="contained" onPress={() => {
              handleSubmmit()
            }} style={{marginVertical: 20}}>
              Agregar
            </Button>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
      <Portal>
        <Modal visible={visibleDelete} onDismiss={hideModalDelete} contentContainerStyle={$modalStyle}>
          <View style={{position: "absolute", top: 0, right: 0, width: 50, height: 50, zIndex: 100}}>
            <TouchableOpacity onPress={hideModalDelete} style={$closeButton}>
              <MaterialCommunityIcons name="close" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={'height'} enabled>
            <Text variant="headlineMedium" className="mb-3">Eliminar Cita</Text>
            <Text variant="labelLarge" className="text-left my-1" style={{color: theme.colors.onSurface }}>¿Está seguro que desea eliminar la cita con fecha: {selectedAppointment?.getDate} y hora: {selectedAppointment?.getTime}?</Text>
            
            <Button mode="contained" onPress={() => {
              handleConfirmDelete()
            }} style={{marginVertical: 20}}>
              Eliminar
            </Button>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
        <View className="flex-row space-x-2" style={{position: "absolute", top: 0, right: 0, padding: 5}}>
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="check" size={24} color={pending ? 'gray' : 'green'} />}
            value="theme"
            style={{backgroundColor: theme.colors.secondary, zIndex: 100, marginTop: 5}}
            onPress={() => setPending(!pending)}
          />
          <ToggleButton
            icon={() => <MaterialCommunityIcons name="plus" size={24} color={theme.colors.background} />}
            value="theme"
            style={{backgroundColor: theme.colors.secondary, zIndex: 100, marginTop: 5}}
            onPress={handleAdd}
          />
        </View>
        <Text variant="displayMedium" className="text-center font-bold" style={$mainTitle}>Citas</Text>
        <Text variant="labelLarge" className="text-left mb-4" style={{color: theme.colors.onSurface}}>{errorMessage}</Text>
        
        {/* <AppointmentCard /> */}


        <FlatList<Appointment>
          style={{flex: 1, width: "100%"}}
          data={pending ? doctorStore.getPendingAppointmentsList : doctorStore.getAppointmentsList}
          contentContainerStyle={{paddingBottom: 5}}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <View style={{flex: 1, width: "100%", marginBottom: 15}}>
              <AppointmentCard appointment={item} onDelete={handleDelete} selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment} />
            </View>
          )}
        />
      </View>

    </Screen>
  )
})
