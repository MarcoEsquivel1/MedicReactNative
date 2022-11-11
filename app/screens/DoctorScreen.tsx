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
    backgroundColor: theme.colors.tertiaryContainer,
    paddingHorizontal: 20,
  }
  
  const $screenContentContainer: ViewStyle = {
    flex: 1,
    backgroundColor: "black",
    marginBottom: 50,
  }
  
  const $loginContainer: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.tertiaryContainer,
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
      <StatusBar backgroundColor={theme.colors.tertiaryContainer}/>
      <View style={$loginContainer}>
        <Text variant="displayLarge" className="text-center" style={$titleLogin}>Perfil</Text>
        <TextInput label="Nombre Doctor" value={username} onChangeText={setUsername} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.tertiaryContainer}} error={emptyUsername}/>
        <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" style={{marginVertical: 10, backgroundColor: theme.colors.tertiaryContainer}} error={emptyPassword}/>
        
        <Text variant="labelLarge" className="text-left my-1" style={{color: error ? 'red' : 'blue'}}>{errorMessage}</Text>
        <Button mode="contained" onPress={() => {
          navigation.navigate("Welcome")
          }} 
          style={{marginVertical: 10}}>
          Regresar <MaterialCommunityIcons name="home" size={16} color="white" />
        </Button>

      </View>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
