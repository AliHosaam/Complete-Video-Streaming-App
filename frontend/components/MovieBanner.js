import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { LinearGradient } from "expo-linear-gradient";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { addMovieToList, removeMovieFromList } from "../api/myListAPI";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";

export default function MovieBanner({
  moviesList,
  mylist,
  handleBanner,
  posterPlayButton,
  posterInfoButton,
  isLoading,
}) {
  const navigation = useNavigation();
  const [userMyList, setUserMyList] = useState(mylist);

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Drop Image */}
        <Skeleton
          width={responsiveWidth(100)}
          height={responsiveHeight(70)}
          radius={0}
          colorMode="dark"
          transition={{ type: "timing" }}
        />
        <View style={styles.skeletonButtonsOverlay}>
          {/* My List Button Skeleton */}
          <View style={styles.skeletonButtonColumn}>
            {/* Icon */}
            <Skeleton
              width={40}
              height={40}
              radius={20}
              transition={{ type: "timing" }}
              colorMode="dark"
            />

            {/* Text */}
            <Skeleton width={60} height={20} radius={4} colorMode="dark" />
          </View>

          {/* Play Button Skeleton */}
          <View style={styles.skeletonPlayButton}>
            <Skeleton
              width={responsiveWidth(20)}
              height={50}
              radius={responsiveWidth(2)}
              colorMode="dark"
              transition={{ type: "timing" }}
            />
          </View>

          {/* Info Button Skeleton */}
          <View style={styles.skeletonButtonColumn}>
            {/* Icon */}
            <Skeleton
              width={40}
              height={40}
              radius={20}
              colorMode="dark"
              transition={{ type: "timing" }}
            />

            {/* Text */}
            <Skeleton width={60} height={20} radius={4} colorMode="dark" />
          </View>
        </View>
      </View>
    );
  }

  const addToList = async (item) => {
    try {
      let response;

      if (userMyList.includes(item._id)) {
        response = await removeMovieFromList(item._id);
      } else {
        response = await addMovieToList(item._id);
      }

      setUserMyList(response.user.mylist);
      navigation.navigate("Home", { mylist: response.user.mylist });
    } catch (error) {
      console.error("Error adding/removing movie from list:", error);
    }
  };

  const renderMovieBanner = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleBanner(item)}>
        <ImageBackground
          source={{ uri: item.posterPath }}
          resizeMode="cover"
          style={styles.posterImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,1)"]}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              onPress={() => addToList(item)}
              style={styles.myListButton}
            >
              {userMyList.includes(item._id) ? (
                <AntDesignIcon name="checkcircle" size={30} color="#daa520" />
              ) : (
                <AntDesignIcon name="plus" size={30} color="white" />
              )}
              <Text style={styles.myListText}>My List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => posterPlayButton(item._id, item.downloadLink)}
              style={styles.posterPlayButton}
            >
              <EntypoIcon name="controller-play" size={30} color="black" />
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => posterInfoButton(item)}
              style={styles.posterInfoButton}
            >
              <AntDesignIcon name="infocirlceo" size={30} color="white" />
              <Text style={styles.infoButtonText}>Info</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        pagingEnabled
        data={moviesList}
        keyExtractor={(item) => item._id}
        renderItem={renderMovieBanner}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(70),
    width: "100%",
  },
  posterImage: {
    width: responsiveWidth(100),
    height: "100%",
    justifyContent: "flex-end",
  },
  linearGradient: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  myListText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginTop: responsiveHeight(0.5),
  },
  playText: {
    color: "black",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  infoButtonText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginTop: responsiveHeight(0.5),
  },
  posterPlayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(2),
  },
  posterInfoButton: {
    alignItems: "center",
  },
  myListButton: {
    alignItems: "center",
  },
  skeletonButtonsOverlay: {
    position: "absolute",
    bottom: responsiveHeight(4),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(6),
  },

  skeletonButtonColumn: {
    alignItems: "center",
    gap: 10,
  },

  skeletonPlayButton: {
    backgroundColor: "transparent",
  },
});
