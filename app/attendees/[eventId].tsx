import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, FlatList } from "react-native";

import { Text, View } from "@/components/Themed";
import { useLocalSearchParams, useGlobalSearchParams, Link } from "expo-router";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import UrlConfig from "@/config/urlConfig";
import { List } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Image } from "react-native";
import QRCodeScanner from "@/components/qrcode";
import { IconButton, MD3Colors, Modal, Portal } from "react-native-paper";
import {router } from "expo-router";

const LeftSwipeActions = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "#ccffbd", justifyContent: "center" }}
    >
      <Text
        style={{
          color: "#40394a",
          paddingHorizontal: 10,
          fontWeight: "600",
        }}
      >
        Bookmark
      </Text>
    </View>
  );
};
const rightSwipeActions = () => {
  return (
    <View
      style={{
        backgroundColor: "#ff8303",
        justifyContent: "center",
        alignItems: "flex-end",
      }}
    >
      <Text
        style={{
          color: "#1b1a17",
          paddingHorizontal: 10,
          fontWeight: "600",
          paddingVertical: 20,
        }}
      >
        Delete
      </Text>
    </View>
  );
};
const swipeFromLeftOpen = () => {
  alert("Swipe from left");
};
const swipeFromRightOpen = () => {
  alert("Swipe from right");
};

export default function AttendeeScreen() {
  const glob = useGlobalSearchParams();
  const local = useLocalSearchParams();

  const [attendees, setAttendees] = useState([]);
  const axiosPrivate = useAxiosPrivate();
   const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};


  async function fetchAttendees() {
    axiosPrivate
      .get(UrlConfig?.event.attendeeList(local.eventId))
      .then((res) => {
        setAttendees(res.data.data);
      });
  }

  console.log("attendees", attendees);

 useEffect(() => {
   const fetchData = async () => {
     try {
       await fetchAttendees();
     } catch (error) {
       console.error("Error fetching attendees:", error);
     }
   };

   fetchData();
 }, []);

  const renderItem = ({ item }: any) => (
    <Swipeable
      renderLeftActions={LeftSwipeActions}
      renderRightActions={rightSwipeActions}
      onSwipeableRightOpen={swipeFromRightOpen}
      onSwipeableLeftOpen={swipeFromLeftOpen}
      key={item._id}
    >
      <List.Item
        title={item.name || "Attendee"}
        description={() => (
          <View>
            <Text>{item.email}</Text>
            <Text>{item.orderType.map((type: any) => type.trim()).join(", ")}</Text>
          </View>
        )}
        titleStyle={styles.title}
        right={(props) =>
          item.checkedIn ? (
            <List.Icon {...props} icon="sticker-check" color="green" />
          ) : null
        }
        style={styles.listItem}
      />
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={attendees}
        renderItem={renderItem}
        //@ts-ignore
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      <IconButton
        icon="scan-helper"
        iconColor={MD3Colors.error50}
        size={30}
        onPress={() => {
          router.navigate("modal");
        }}
        style={styles.scanButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    backgroundColor: "transparent",
  },
  listContainer: {
    paddingBottom: 10,
  },
  listItem: {
    paddingVertical: 10, // Add padding to the top and bottom of the list item
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff", // Add padding to the left and right of the list item
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5, // optional: if you want to make it circular
  },
  scanButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    width: 80,
    height: 80,
    borderRadius: 50,
    zIndex: 100,
    shadowColor: "#000", // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.5, // Shadow opacity for iOS
    shadowRadius: 2.5, // Shadow radius for iOS
    elevation: 5, // Elevation for Android
  },
});
