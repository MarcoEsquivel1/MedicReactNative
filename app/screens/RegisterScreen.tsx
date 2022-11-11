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
import { isLoading } from "expo-font"

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const RegisterScreen: FC<StackScreenProps<AppStackScreenProps, "Register">> = observer(function RegisterScreen(props) {
  const { navigation } = props;
  const { authStore } = useStores()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState(false)
  const [emptyPassword, setEmptyPassword] = useState(false)
  const [empityPasswordConfirmation, setEmptyPasswordConfirmation] = useState(false)
  const [emptyEmail, setEmptyEmail] = useState(false)
  const [emptyUsername, setEmptyUsername] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    setIsLoading(authStore.getIsLoading)
  }, [authStore.isLoading]);

  useEffect(() => {
    authStore.setIsLoading(false)
    authStore.setIsError(false)
    authStore.setErrorMessage("")
  }, []);
  
  useEffect(() => {
    setError(authStore.getIsError)
    setErrorMessage(authStore.getErrorMessage)
  }, [authStore.isError , authStore.errorMessage]);

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
  
  const $registerContainer: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.onPrimary,
    width: "100%",
    height: "100%",
    justifyContent: "center",   
  }

  const $titleregister: TextStyle = {
    color: theme.colors.primary,
  }

  function handleregister() {
    if (username === "") {
      setEmptyUsername(true)
    }else{
      setEmptyUsername(false)
    }
    if (password === "") {
      setEmptyPassword(true)
    }else{
      setEmptyPassword(false)
    }
    if (password_confirmation === "") {
      setEmptyPasswordConfirmation(true)
    }else{
      setEmptyPasswordConfirmation(false)
    }
    if (email === "") {
      setEmptyEmail(true)
    }else{
      setEmptyEmail(false)
    }
    if (username !== "" && password !== "" && password_confirmation !== "" && email !== "") {
      setEmptyPassword(false)
      setEmptyUsername(false)
      setEmptyEmail(false)
      setEmptyPasswordConfirmation(false)
      authStore.setAuthUsername(username)
      authStore.setAuthEmail(email)
      authStore.setAuthPassword(password)
      authStore.setAuthPasswordConfirm(password_confirmation)
      setUsername("")
      setPassword("")
      setPasswordConfirmation("")
      setEmail("")
      authStore.register()
      console.log("register")
    }
  } 

  if(isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
      <StatusBar backgroundColor={theme.colors.onPrimary}/>
      <View style={$registerContainer}>
        <Text variant="displayLarge" className="text-center" style={$titleregister}>Crear cuenta</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={{marginVertical: 10}} error={emptyEmail}/>
        <TextInput label="Username" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10}} error={emptyUsername}/>
        <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10}} error={emptyPassword}/>
        <TextInput label="Password Confirmation" secureTextEntry value={password_confirmation} onChangeText={setPasswordConfirmation} mode="outlined" style={{marginVertical: 10}} error={empityPasswordConfirmation}/>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'blue'}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleregister()
          }} 
          style={{marginVertical: 10}}>
          Crear cuenta <MaterialCommunityIcons name="account-plus" size={16} color="white" />
        </Button>
        <Button mode="outlined" onPress={() => {
          authStore.setErrorMessage("")
          navigation.navigate("Login")
          }} style={{marginVertical: 10}}>
          Iniciar Sesión <MaterialCommunityIcons name="login" size={16} color={theme.colors.primary} />
        </Button>

      </View>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
