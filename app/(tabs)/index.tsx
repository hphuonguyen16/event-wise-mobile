import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { List } from "react-native-paper";
import { StyleSheet, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import UrlConfig from "@/config/urlConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";



export default function TabOneScreen() {
  const [events, setEvents] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  async function fetchEvents() {
    axiosPrivate.get(UrlConfig?.event.getMyEvents).then((res) => {
      setEvents(res.data.data);
    });
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }: any) => (
    
      <List.Item
        key={item._id}
        title={item.title}
        description={item.location.formatted}
        titleStyle={styles.title}
        left={(props) => (
          <Image
            {...props}
            source={{ uri: item.images[0] }}
            style={styles.image}
          />
        )}
        onPress={() => router.push(`/attendees/${item._id}`)}
        style={styles.listItem}
      />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        //@ts-ignore
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
    marginTop: 10,
    marginRight: 5,
    backgroundColor: "transparent",
  },
  listContainer: {
    paddingBottom: 10,
  },
  listItem: {
    paddingVertical: 15, // Add padding to the top and bottom of the list item
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
});
