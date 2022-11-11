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
  const { authStore } = useStores()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [emptyPassword, setEmptyPassword] = useState(false)
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
  }, [authStore.isError, authStore.errorMessage]);

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
      <View style={$loginContainer}>
        <Text variant="displayLarge" className="text-center" style={$titleLogin}>Login</Text>
        <TextInput label="Username/Email" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10}} error={emptyUsername}/>
        <TextInput label="Password" secureTextEntry value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10}} error={emptyPassword}/>
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'blue'}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          handleLogin()
          }} 
          style={{marginVertical: 10}}>
          Iniciar Sesión <MaterialCommunityIcons name="login" size={16} color="white" />
        </Button>
        <Button mode="outlined" onPress={() => {
          authStore.setErrorMessage("")
          navigation.navigate("Register")
          }} style={{marginVertical: 10}}>
          Registrarse <MaterialCommunityIcons name="account-plus" size={16} color={theme.colors.primary} />
        </Button>

      </View>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
