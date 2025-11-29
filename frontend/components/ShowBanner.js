import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { LinearGradient } from "expo-linear-gradient";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import EntypoIcon from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { Skeleton } from "moti/skeleton";
import { addShowToList, removeShowFromList } from "../api/myListAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ShowBanner({
  showsList,
  showMylist,
  handleBanner,
  posterPlayButton,
  posterInfoButton,
  updateUserShowMylist,
  isLoading,
}) {
  const navigation = useNavigation();
  const [userShowMylist, setUserShowMylist] = useState(showMylist);

  useEffect(() => {
    const fetchUserShowMylist = async () => {
      try {
        const storedUserShowMylist = await AsyncStorage.getItem(
          "userShowMylist"
        );

        setUserShowMylist(storedUserShowMylist);
      } catch (error) {
        console.error("Error fetching user show mylist:", error);
      }
    };

    fetchUserShowMylist();
  }, []);

  const moveToMoviesScreen = () => {
    navigation.goBack();
  };

  const addToList = async (item) => {
    try {
      let response;

      if (userShowMylist.includes(item._id)) {
        response = await removeShowFromList(item._id);
      } else {
        response = await addShowToList(item._id);
      }
      const updatedUserShowMylist = response.user.showsMylist;
      setUserShowMylist(response.user.showsMylist);

      await AsyncStorage.setItem(
        "userShowMylist",
        JSON.stringify(updatedUserShowMylist)
      );
      updateUserShowMylist(updatedUserShowMylist);
    } catch (error) {
      console.error("Error adding/removing show from list:", error);
    }
  };

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

        {/* TV Shows Button Skeleton */}
        <View style={styles.skeletonTvShowsWrapper}>
          <Skeleton
            width={100}
            height={35}
            radius={6}
            colorMode="dark"
            transition={{ type: "timing" }}
          />
        </View>

        <View style={styles.skeletonButtonsOverlay}>
          {/* My List Button Skeleton */}
          <View style={styles.skeletonButtonColumn}>
            <Skeleton width={40} height={40} radius={20} colorMode="dark" />
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
            <Skeleton width={40} height={40} radius={20} colorMode="dark" />
            <Skeleton width={60} height={20} radius={4} colorMode="dark" />
          </View>
        </View>
      </View>
    );
  }

  const renderShowBanner = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleBanner(item)}>
        <ImageBackground
          source={{ uri: item.posterPath }}
          resizeMode="cover"
          style={styles.posterImage}
        >
          <TouchableOpacity
            style={styles.transparentButton}
            onPress={moveToMoviesScreen}
          >
            <Text style={styles.buttonText}>Movies</Text>
          </TouchableOpacity>
          <LinearGradient
            colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,1)"]}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              onPress={() => addToList(item)}
              style={styles.myListButton}
            >
              {userShowMylist?.includes(item._id) ? (
                <AntDesignIcon name="check-circle" size={30} color="#daa520" />
              ) : (
                <AntDesignIcon name="plus" size={30} color="white" />
              )}

              <Text style={styles.myListText}>My List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => posterPlayButton(item)}
              style={styles.posterPlayButton}
            >
              <EntypoIcon name="controller-play" size={30} color="black" />
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => posterInfoButton(item)}
              style={styles.posterInfoButton}
            >
              <AntDesignIcon name="info-circle" size={30} color="white" />
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
        data={showsList}
        keyExtractor={(item) => item._id}
        renderItem={renderShowBanner}
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
  skeletonTvShowsWrapper: {
    position: "absolute",
    top: responsiveHeight(6),
    right: responsiveWidth(3),
  },
  transparentButton: {
    position: "absolute",
    top: responsiveHeight(6),
    right: responsiveWidth(3),
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
});
