import { observer } from "mobx-react-lite"
import React, {
  FC, useEffect, useState, useContext,
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, Button, MD2Colors, Text, TextInput } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { AppContext } from '../context/AppContextProvider.js'

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

  // @ts-ignore
  const { theme } = useContext(AppContext)
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
      <StatusBar backgroundColor={theme.colors.onPrimary}/>
      <KeyboardAvoidingView behavior={'height'} enabled style={$mainContainer}>
        <Text variant="displayLarge" className="text-center" style={$mainTitle}>Crear cuenta</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={{marginVertical: 10}} error={emptyEmail}/>
        <TextInput label="Username" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10}} error={emptyUsername}/>
        <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10}} error={emptyPassword}/>
        <TextInput label="Password Confirmation" secureTextEntry value={password_confirmation} onChangeText={setPasswordConfirmation} mode="outlined" style={{marginVertical: 10}} error={empityPasswordConfirmation}/>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'blue'}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleregister()
          }} 
          style={{marginVertical: 10}}>
          Crear cuenta <MaterialCommunityIcons name="account-plus" size={16} color={theme.colors.onPrimary} />
        </Button>
        <Button mode="outlined" onPress={() => {
          authStore.setErrorMessage("")
          navigation.navigate("Login")
          }} style={{marginVertical: 10}}>
          Iniciar Sesión <MaterialCommunityIcons name="login" size={16} color={theme.colors.primary} />
        </Button>

      </KeyboardAvoidingView>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
