import { observer } from "mobx-react-lite"
import React, {
  FC, useState,
} from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle, useWindowDimensions, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "../components"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  ) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const { authStore } = useStores()

  const theme = useTheme();
  const $root: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.onPrimary,
    paddingHorizontal: 20,
  }
  
  const $screenContentContainer: ViewStyle = {
    flex: 1,
    backgroundColor: "black",
    marginBottom: 50,
  }
  
  const $loginContainer: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.onPrimary,
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
      <StatusBar backgroundColor={theme.colors.onPrimary}/>
      <View style={$loginContainer}>
        <Text variant="displayLarge" className="text-center" style={$titleLogin}>Login</Text>
        <TextInput label="Username/Email" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10}}/>
        <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10}}/>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'transparent'}}>Error en credenciales</Text>
        <Button mode="contained" onPress={() => console.log('Pressed')} style={{marginVertical: 10}}>
          Iniciar Sesión <MaterialCommunityIcons name="login" size={16} color="white" />
        </Button>
        <Button mode="contained" onPress={() => console.log('Pressed')} style={{marginVertical: 10}}>
          Registrarse <MaterialCommunityIcons name="account-plus" size={16} color="white" />
        </Button>

      </View>
      

    </Screen>
  )
})


