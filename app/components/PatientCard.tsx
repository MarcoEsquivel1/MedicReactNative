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
import { Patient } from "../models/Patient"

export interface PatientCardProps {
  /**
   * An optional style override useful for padding & margin.
   */
  patient: Patient
}

/**
 * Describe your component here
 */
export const PatientCard = observer(function PatientCard(props: PatientCardProps) {
  const { patient } = props
  const { authStore, doctorStore, themeStore } = useStores()
  // @ts-ignore
  const { theme, setTheme } = useContext(AppContext)
  useEffect(() => {
    setTheme(themeStore.getTheme)
  }, [themeStore.theme]);

  
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

  return (
    <View style={$card}>
      <View style={{position: "absolute", top: 0, right: 0, padding: 0}}>
        <TouchableOpacity onPress={() => {}} style={$deleteButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={34} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
      <View className="w-9/12">
        <Text variant="headlineSmall" style={$cardText}>{patient.getName}</Text>
      </View>
      <View className="flex flex-row justify-between">
        <View className="w-1/3 items-center justify-center">
          <MaterialCommunityIcons name="account-outline" size={120} color={$cardText.color} />
        </View>
        <View className="w-2/3 items-center justify-center">
          <View className="" style={$horasItem}>
            <Text variant="labelLarge" style={$cardText}>DNI: {patient.getDni} </Text>
          </View>
          <View className="" style={$horasItem}>
            <Text variant="labelLarge" style={$cardText}>F. Nacimiento: {patient.getBirthday}</Text>
          </View>
          <View className="" style={$horasItem}>
            <Text variant="labelLarge" style={$cardText}>Contacto: {patient.getPhone}</Text>
          </View>
        </View>
      </View>
    </View>
  )
})