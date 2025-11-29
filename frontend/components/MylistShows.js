import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { Skeleton } from "moti/skeleton";
import { showsMylist } from "../api/myListAPI";

export default function MylistShows({ label, userShowsMylist, handleBanner }) {
  const [showsList, setShowsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyListShows = async () => {
      const shows = await showsMylist();
      setShowsList(shows.showsInMyList);
      setIsLoading(false);
    };

    fetchMyListShows();
  }, [userShowsMylist]);

  const renderShowCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handleBanner(item)}
        activeOpacity={0.8}
        style={styles.showCardContainer}
      >
        <Image source={{ uri: item.posterPath }} style={styles.showCardImage} />
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Skeleton for label */}
        <Skeleton
          width={80}
          height={20}
          radius="round"
          colorMode="dark"
          transition={{ type: "timing" }}
        />

        {/* Skeletons for poster list */}
        <View style={styles.skeletonRow}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              width={150}
              height={210}
              radius={6}
              colorMode="dark"
              transition={{ type: "timing" }}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <FlatList
        data={showsList}
        keyExtractor={(item) => item._id}
        renderItem={renderShowCard}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    height: 250,
  },
  label: {
    color: "white",
    paddingHorizontal: 10,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.5),
  },
  showCardContainer: {
    marginRight: 10,
    borderRadius: 20,
  },
  showCardImage: {
    borderRadius: 10,
    width: 150,
    height: "100%",
  },
  skeletonRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
});
