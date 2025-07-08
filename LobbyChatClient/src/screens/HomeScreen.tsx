import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { RootStackParamList } from "../../App";
import { Button, StyleSheet, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({navigation}: Props) => {
  return (
  <View style={styles.container}>
    <Button title="Join Lobby"
    onPress={() => navigation.navigate("Chat")} />
  </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});