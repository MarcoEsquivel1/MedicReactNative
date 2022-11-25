import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView, TouchableOpacity, } from "react-native"
import { Text } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { AppContext } from '../context/AppContextProvider.js'
import { Patient } from "../models/Patient"
import { Appointment } from "../models/Appointment"
import Animated, { FadeInLeft, FadeInRight, FadeOut } from "react-native-reanimated"

export interface AppointmentCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  appointment: Appointment
  index: number
  onDelete: () => void
  selectedAppointment: Appointment
  setSelectedAppointment: (appointment: Appointment) => void
}

/**
 * Describe your component here
 */
export const AppointmentCard = observer(function AppointmentCard(props: AppointmentCardProps) {
  const { appointment, onDelete, setSelectedAppointment, index } = props
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

  const $onPressChangeState = () => {
    let done = appointment.getDone
    if (done == 1) {
      done = 0
    } else if (done == 0) {
      done = 1
    }
    const token = authStore.getAuthToken
    doctorStore.updateStateAppointment(appointment.getId, done, token)
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
    <Animated.View
      entering={FadeInRight.delay(index * 300)}
      exiting={FadeOut.delay(index * 300)}
    >

      <TouchableOpacity onPress={appointment.navigate}>
        <View style={$card}>
          <View style={{ position: "absolute", top: 0, right: 0, padding: 0 }}>
            <TouchableOpacity onPress={$onPressDelete} style={$deleteButton}>
              <MaterialCommunityIcons name="trash-can-outline" size={34} color={theme.colors.surface} />
            </TouchableOpacity>
          </View>
          <View style={{ position: "absolute", bottom: 0, right: 0, padding: 0 }}>
            <TouchableOpacity onPress={$onPressChangeState} style={$checkButton}>
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
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
})

