import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import UrlConfig from "@/config/urlConfig";
import { Snackbar } from "react-native-paper";

const QRCodeScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [snackbarMessage, setSnackbarMessage] = useState({
    name: "",
    orderType: [],
    message: "",
    isError: false,
  });
  const [visible, setVisible] = React.useState(false);

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log(data)
    // alert(`Scanned ${type} code with data: ${data}`);
    try {
      const response = await axiosPrivate.get(UrlConfig.order.checkIn(data));
      if (response.data.status === "success") {
        const attendeeInfo = response.data.data;
       setSnackbarMessage({
         name: attendeeInfo.name,
         orderType: attendeeInfo.orderType,
         message: "Checked In Successfully",
         isError: false,
       });
        setVisible(true);
      } else {
        alert("Check in failed");
      }
    } catch (error) {
      setSnackbarMessage({
        name: "",
        orderType: [],
        message: error.response?.data?.message || "Check in failed",
        isError: true,
      });
      setVisible(true);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ width: 500, height: 470, borderRadius: 10, marginBottom: 10}}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} style={styles.scanAgain} />
      )}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Close",
          onPress: () => {
            setVisible(false);
          },
        }}
        style={
          snackbarMessage.isError
            ? styles.snackbarError
            : styles.snackbarSuccess
        } // Conditionally apply styles
      >
        <Text style={styles.text}>{snackbarMessage.message}</Text>
        <Text style={styles.text}>{snackbarMessage.name}</Text>
        <Text style={styles.text}>
          {snackbarMessage.orderType?.map((type) => type.trim()).join(", ")}
        </Text>
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    color: "white",
  },
  snackbar: {
    backgroundColor: "green", // Change the background color to green
  },
  text: {
    color: "white", // Ensure text is readable on a green background
  },
  snackbarError: {
    backgroundColor: "red", // Background color for error
    width: "90%",
  },
  text: {
    color: "white", // Ensure text is readable on colored background
  },
  scanAgain: {
    marginTop: 20,
  },
});

export default QRCodeScanner;
