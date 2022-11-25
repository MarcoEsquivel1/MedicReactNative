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
import { Patient, PatientModel } from "../models/Patient"
import { Appointment } from "../models/Appointment"

export interface AppointmentCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  appointment: Appointment
  onDelete: () => void
  selectedAppointment: Appointment
  setSelectedAppointment: (appointment: Appointment) => void
}

/**
 * Describe your component here
 */
export const AppointmentCard = observer(function AppointmentCard(props: AppointmentCardProps) {
  const { appointment, onDelete, setSelectedAppointment } = props
  const { authStore, doctorStore, themeStore } = useStores()
  const [patient, setPatient] = useState<Patient | null>(null)
  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  useEffect(() => {
    //find patient name
    setPatient(doctorStore.findPatient(appointment.getPatientId))
  }, []);

  const $onPressDelete = () => {
    setSelectedAppointment(appointment)
    onDelete()
  }

  const $card: ViewStyle = {
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    padding: 10,
  }

  const $cardText: TextStyle = {
    color: theme.colors.surface,
  }

  const $deleteButton: ViewStyle = {
    backgroundColor: theme.colors.error,
    borderRadius: 20,
    borderBottomEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 5,
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  }
  
  const $checkButton: ViewStyle = {
    backgroundColor: appointment.getDone == 1 ? 'lightgreen' : 'lightgray',
    borderRadius: 20,
    borderBottomStartRadius: 0,
    borderTopEndRadius: 0,
    padding: 5,
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  }

  const $horasItem: ViewStyle = {
    backgroundColor: theme.colors.onSecondaryContainer,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  }

  return (
    <View style={$card}>
          <View style={{position: "absolute", top: 0, right: 0, padding: 0}}>
            <TouchableOpacity onPress={$onPressDelete} style={$deleteButton}>
              <MaterialCommunityIcons name="trash-can-outline" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <View style={{position: "absolute", bottom: 0, right: 0, padding: 0}}>
            <TouchableOpacity onPress={()=>{}} style={$checkButton}>
              <MaterialCommunityIcons name="check-bold" size={34} color={appointment.getDone == 1 ? "green" : 'gray'} />
            </TouchableOpacity>
          </View>
          <View className="w-9/12">
            <Text variant="headlineSmall" style={$cardText}>{patient?.getName}</Text>
          </View>
          <View className="flex flex-row justify-between mt-3">
            <View className="w-2/3 items-center justify-center">
              <View className="" style={$horasItem}>
                <Text variant="labelLarge" style={$cardText}>F. Cita: {appointment.getDate}</Text>
              </View>
              <View className="" style={$horasItem}>
                <Text variant="labelLarge" style={$cardText}>Hora Cita:  {appointment.getTime}</Text>
              </View>
              <View className="" style={$horasItem}>
                <Text variant="labelLarge" style={$cardText}>Estado: {appointment.getDone == 1 ? "Completa" : "Pendiente"}</Text>
              </View>
            </View>
            <View className="w-1/3 items-center justify-center">
              {/* <MaterialCommunityIcons name="account-outline" size={120} color={$cardText.color} /> */}
            </View>
          </View>
        </View>
  )
})

