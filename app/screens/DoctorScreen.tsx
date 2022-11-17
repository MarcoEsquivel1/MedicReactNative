import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, MD2Colors, Button, Text, TextInput, useTheme, ToggleButton } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { TimePickerModal } from 'react-native-paper-dates'
import { AppContext } from '../context/AppContextProvider.js'
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../models"

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Doctor: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Doctor" component={DoctorScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const DoctorScreen: FC<StackScreenProps<AppStackScreenProps, "Doctor">> = observer(function DoctorScreen(props) {
  const { navigation } = props;
  const { authStore, doctorStore, themeStore } = useStores()
  const [doctor_Name, setDoctorName] = useState("")
  const [start_time, setStartTime] = useState(null)
  const [end_time, setEndTime] = useState(null)
  const [error, setError] = useState(false)
  const [emptyStartTime, setEmptyStartTime] = useState(false)
  const [emptyEndTime, setEmptyEndTime] = useState(false)
  const [emptyDoctorName, setEmptyDoctorName] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)

  function handleUpdate() {
    if (doctor_Name === "") {
      setEmptyDoctorName(true)
    } else {
      setEmptyDoctorName(false)
    }
    if (start_time === null) {
      setEmptyStartTime(true)
    } else {
      setEmptyStartTime(false)
    }
    if (end_time === null) {
      setEmptyEndTime(true)
    } else {
      setEmptyEndTime(false)
    }
    if (doctor_Name !== "" && start_time !== null && end_time !== null) {
      setEmptyDoctorName(false)
      setEmptyStartTime(false)
      setEmptyEndTime(false)
      
      doctorStore.setNombreDoctor(doctor_Name)
      doctorStore.setStartTime(start_time)
      doctorStore.setEndTime(end_time)
      const token = authStore.getAuthToken
      doctorStore.updateDoctor(token)

      setDoctorName("")
      setStartTime(null)
      setEndTime(null)
    }
  }

  const handleThemeChange = () => {
    themeStore.toggleTheme()
  }

  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  const onDismiss1 = React.useCallback(() => {
    setVisible1(false)
  }, [setVisible1])

  const onConfirm1 = React.useCallback(
    ({ hours, minutes }) => {
      setVisible1(false);
      if(minutes >= 10 && hours >= 10){
        setStartTime(`${hours}:${minutes}`)
      }else if(minutes < 10 && hours >= 10){
        setStartTime(`${hours}:0${minutes}`)
      }else if(minutes >= 10 && hours < 10){
        setStartTime(`0${hours}:${minutes}`)
      }else{
        setStartTime(`0${hours}:0${minutes}`)
      }
    },
    [setVisible1]
  );

  useEffect(() => {
    setIsLoading(doctorStore.getIsLoading)
  }, [doctorStore.isLoading])

  const onDismiss2 = React.useCallback(() => {
    setVisible2(false)
  }, [setVisible2])

  const onConfirm2 = React.useCallback(
    ({ hours, minutes }) => {
      setVisible2(false);
      if(minutes >= 10 && hours >= 10){
        setEndTime(`${hours}:${minutes}`)
      }else if(minutes < 10 && hours >= 10){
        setEndTime(`${hours}:0${minutes}`)
      }else if(minutes >= 10 && hours < 10){
        setEndTime(`0${hours}:${minutes}`)
      }else{
        setEndTime(`0${hours}:0${minutes}`)
      }
    },
    [setVisible2]
  );

  useEffect(() => {
    setIsLoading(doctorStore.getIsLoading)
  }, [doctorStore.isLoading]);

  useEffect(() => {
    doctorStore.setIsLoading(false)
    doctorStore.setIsError(false)
    doctorStore.setErrorMessage("")
    const token = authStore.getAuthToken
    doctorStore.getDoctor(token)
    setDoctorName(doctorStore.getNombreDoctor)
    setStartTime(doctorStore.getStartTime)
    setEndTime(doctorStore.getEndTime)
  }, []);

  useEffect(() => {
    setDoctorName(doctorStore.getNombreDoctor)
    setStartTime(doctorStore.getStartTime)
    setEndTime(doctorStore.getEndTime)
  }, [doctorStore.nombre_doctor, doctorStore.start_time, doctorStore.end_time]);
  
  useEffect(() => {
    setError(doctorStore.getIsError)
    setErrorMessage(doctorStore.getErrorMessage)
  }, [doctorStore.isError, doctorStore.errorMessage]);

  const $root: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.onPrimary,
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.onPrimary}}>
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
        label="Hora de entrada" // optional, default 'Select time'
        uppercase={false} // optional, default is true
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale="fr" // optional, default is automically detected by your system
        // keyboardIcon="keyboard-outline" // optional, default is "keyboard-outline"
        // clockIcon="clock-outline" // optional, default is "clock-outline"
      /> 
    <TimePickerModal
        // @ts-ignore
        clockIcon={() => <MaterialCommunityIcons name="clock" size={24} color={theme.colors.onBackground}/>}
        // @ts-ignore
        keyboardIcon={() => <MaterialCommunityIcons name="keyboard" size={24} color={theme.colors.onBackground}/>}
        visible={visible2}
        onDismiss={onDismiss2}
        onConfirm={onConfirm2}
        hours={16} // default: current hours
        minutes={0} // default: current minutes
        label="Hora de salida" // optional, default 'Select time'
        uppercase={false} // optional, default is true
        cancelLabel="Cancel" // optional, default: 'Cancel'
        confirmLabel="Ok" // optional, default: 'Ok'
        animationType="fade" // optional, default is 'none'
        locale="fr" // optional, default is automically detected by your system
        // keyboardIcon="keyboard-outline" // optional, default is "keyboard-outline"
        // clockIcon="clock-outline" // optional, default is "clock-outline"
      /> 

      <StatusBar backgroundColor={theme.colors.onPrimary}/>
      <KeyboardAvoidingView behavior={'height'} enabled style={$mainContainer}>
      <View style={{position: "absolute", top: 0, right: 0, padding: 10}}>
        <ToggleButton
          icon={() => <MaterialCommunityIcons name="theme-light-dark" size={24} color={theme.colors.onPrimary} />}
          value="theme"
          style={{backgroundColor: theme.colors.primary}}
          onPress={handleThemeChange}
        />
        </View>
        <Text variant="displayLarge" className="text-center" style={$mainTitle}>Perfil</Text>
        <TextInput label="Nombre Doctor" value={doctor_Name} onChangeText={setDoctorName} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.onPrimary}} error={emptyDoctorName}/>
        
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TextInput label="Hora de entrada" value={start_time} onChangeText={setStartTime} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.onPrimary, width: "75%"}} error={emptyStartTime} disabled/>
          <Button mode="contained" onPress={() => setVisible1(true)} style={{width: "20%"}}><MaterialCommunityIcons name="clock-outline" size={20} color= {theme.colors.onPrimary} /></Button>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TextInput label="Hora de salida" value={end_time} onChangeText={setEndTime} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.onPrimary, width: "75%"}} error={emptyEndTime} disabled/>
          <Button mode="contained" onPress={() => setVisible2(true)} style={{width: "20%"}}><MaterialCommunityIcons name="clock-outline" size={20} color= {theme.colors.onPrimary} /></Button>
        </View>

        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? theme.colors.error : theme.colors.primary}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleUpdate()
          }} 
          style={{marginVertical: 10}}>
          Actualizar <MaterialCommunityIcons name="upload" size={16} color= {theme.colors.onPrimary} />
        </Button>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Welcome")
          }} 
          style={{marginVertical: 10, backgroundColor: theme.colors.error}}>
          Regresar <MaterialCommunityIcons name="home" size={16} color= {theme.colors.onPrimary} />
        </Button>

      </KeyboardAvoidingView>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
