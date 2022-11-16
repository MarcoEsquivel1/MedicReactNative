import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState,
} from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, useWindowDimensions, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "../components"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const WelcomeScreen: FC<StackScreenProps<WelcomeScreenProps, "Welcome">> = observer(function WelcomeScreen(props) {
  const { navigation } = props;
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const { authStore, doctorStore} = useStores()


  const theme = useTheme();
  const $root: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 20,
  }
  
  const $screenContentContainer: ViewStyle = {
    flex: 1,
    backgroundColor: "black",
    marginBottom: 50,
  }
  
  const $loginContainer: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.primaryContainer,
    width: "100%",
    height: "100%",
    justifyContent: "center",   
  }

  const $titleLogin: TextStyle = {
    color: theme.colors.primary,
  }
  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >     
      <StatusBar backgroundColor={theme.colors.primaryContainer}/>
      <View style={$loginContainer}>
        <Text variant="displayLarge" className="text-center" style={$titleLogin}>Home</Text>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Doctor")
          }} 
          style={{marginVertical: 10}}>
          Ver Perfil <MaterialCommunityIcons name="medical-bag" size={16} color="white" />
        </Button>
        <Button mode="contained" onPress={() => {
          /* navigation.navigate("Patient") */
          }}
          style={{marginVertical: 10, backgroundColor: theme.colors.secondary}}>
          Ver Pacientes <MaterialCommunityIcons name="account-multiple" size={16} color="white" />
        </Button>
        <Button mode="contained" onPress={() => {
          doctorStore.clearDoctor()
          authStore.logout()
          }} 
          style={{marginVertical: 10, backgroundColor: theme.colors.error}}>
          Cerrar Sesión <MaterialCommunityIcons name="login" size={16} color="white" />
        </Button>
      </View>
      

    </Screen>
  )
})


