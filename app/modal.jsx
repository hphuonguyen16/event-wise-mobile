import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import QRCodeScanner from '@/components/qrcode';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

export default function ModalScreen() {
  useEffect(() => {
    // Ignore specific deprecation warnings
    LogBox.ignoreLogs([
      "Warning: componentWillMount is deprecated",
      "Warning: componentWillReceiveProps is deprecated",
      // Add more warnings to ignore as needed
    ]);
  }, []);
  return (
    <View style={styles.container}>
        <QRCodeScanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  // },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: '80%',
  // },
});
