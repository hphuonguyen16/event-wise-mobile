import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Text, View } from "@/components/Themed";
import { theme } from '@/theme'
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Background from "@/components/Background";
import Logo from "@/components/Logo";
import Header from "@/components/Header";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import BackButton from "@/components/BackButton";
import { router } from 'expo-router'
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import urlConfig from "@/config/urlConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
export default function LoginLayout() {
  const colorScheme = useColorScheme();
  const axiosPrivate = useAxiosPrivate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event: any) => {
    setIsLoggingIn(true);
    console.log(urlConfig.user.login);
     const res = await fetch(urlConfig.user.login, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         email: formData.email,
         password: formData.password,
       }),
       // // credentials: "include", // Add this option
     });
    const resJson = await res.json();
    if (resJson.status === "success") {
        //const user = resJson.data.user as any;
        await AsyncStorage.setItem("access_token", resJson.token);
       // if (user.role === "admin") {
       //   router.push("/admin/overview");
       // } else if (user.role === "business") {
       //   router.push("/business/advertisement");
       // } else {
       //   router.push("/home");
      // }
       router.navigate("(tabs)");
     } else {
       setIsLoggingIn(false);
     }
   };

  return (
    <Background>
      <BackButton goBack={() => console.log("111")} />

      <Logo />

      <Header>Welcome back.</Header>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        // error={!!email.error}
        // errorText={email.error}
        // autoCapitalize="none"
        // autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        // error={!!password.error}
        // errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
        // onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
    // no layout
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
