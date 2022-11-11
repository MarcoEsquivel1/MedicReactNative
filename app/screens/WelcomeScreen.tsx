import { observer } from "mobx-react-lite"
import React, {
  FC,
} from "react"
import { Text, Image, ImageStyle, TextStyle, View, ViewStyle, useWindowDimensions, StatusBar } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "../components"


export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
) {

  return (
    <Screen
      style={$root}
      preset="fixed"
      safeAreaEdges={["top"]}
      contentContainerStyle={$screenContentContainer}
    >     
      <StatusBar backgroundColor={"#3bb9e7"}/>
      <View style={$loginContainer}>
        <TextInput style={$loginInput} placeholder="Username" />
      </View>
      

    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#3bb9e7",
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "black",
}

const $loginContainer: ViewStyle = {
  flex: 1,
  backgroundColor: "#3bb9e7",
  width: "100%",
  height: "100%",
}

const $loginInput: ViewStyle = {
  backgroundColor: "white",
}
