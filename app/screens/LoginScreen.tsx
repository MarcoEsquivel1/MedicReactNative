import { observer } from "mobx-react-lite"
import React, {
  FC, useContext, useEffect, useState,
} from "react"
import { TextStyle, View, ViewStyle, StatusBar, KeyboardAvoidingView } from "react-native"
import { Screen } from "../components"
import { ActivityIndicator, Button, MD2Colors, Text, TextInput } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useStores } from "../models"
import { AppContext } from '../context/AppContextProvider.js'

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `Login: undefined` to AppStackParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="Login" component={LoginScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const LoginScreen: FC<StackScreenProps<AppStackScreenProps, "Login">> = observer(function LoginScreen(props) {
  const { navigation } = props;
  const { authStore, themeStore } = useStores()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [emptyPassword, setEmptyPassword] = useState(false)
  const [emptyUsername, setEmptyUsername] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(true)

  useEffect(() => {
    setIsLoading(authStore.getIsLoading)
  }, [authStore.isLoading]);

  useEffect(() => {
    authStore.setIsLoading(false)
    authStore.setIsError(false)
    authStore.setErrorMessage("")
  }, []);

  const iconpassword = () => {
    if (isSecureTextEntry) {
      return (
        <MaterialCommunityIcons name="eye" size={24} color={theme.colors.onBackground}/>
      )
    } else {
      return (
        <MaterialCommunityIcons name="eye-off" size={24} color={theme.colors.onBackground}/>
      )
    }
  }

  function handleLogin() {
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
    if (username !== "" && password !== "") {
      setEmptyPassword(false)
      setEmptyUsername(false)
      authStore.setAuthUsername(username)
      authStore.setAuthPassword(password)
      setUsername("")
      setPassword("")
      authStore.login()
    }
  } 
  
  useEffect(() => {
    setError(authStore.getIsError)
    setErrorMessage(authStore.getErrorMessage)
  }, [authStore.isError, authStore.errorMessage]);

  const hadleSecureTextEntry = () => {
    setIsSecureTextEntry(!isSecureTextEntry)
  }
  // @ts-ignore
  const { theme } = useContext(AppContext)


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
    backgroundColor: theme.colors.background,
    width: "100%",
    height: "100%",
    justifyContent: "center",   
  }

  const $mainTitle: TextStyle = {
    color: theme.colors.primary,
  }

  if(isLoading){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor: theme.colors.background}}>
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
        <Text variant="displayLarge" className="text-center" style={$mainTitle}>Login</Text>
        <TextInput label="Username/Email" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10}} error={emptyUsername}/>
        <TextInput label="Password" secureTextEntry={isSecureTextEntry} value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10}} error={emptyPassword} right={<TextInput.Icon icon={iconpassword} onPress={hadleSecureTextEntry}/>}/>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'blue'}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleLogin()
          }} 
          style={{marginVertical: 10}}>
          Iniciar Sesión <MaterialCommunityIcons name="login" size={16} color={theme.colors.background} />
        </Button>
        <Button mode="outlined" onPress={() => {
          authStore.setErrorMessage("")
          navigation.navigate("Register")
          }} style={{marginVertical: 10}}>
          Registrarse <MaterialCommunityIcons name="account-plus" size={16} color={theme.colors.primary} />
        </Button>

      </KeyboardAvoidingView>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
