import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";

export default function SearchInput({
  searchTerm,
  setSearchTerm,
  handleResetSearchTerm,
}) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor="grey"
        value={searchTerm}
        onChangeText={(text) => setSearchTerm(text)}
      />
      <IonIcons
        name="search"
        color="grey"
        size="25"
        style={styles.searchIcon}
      />
      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={handleResetSearchTerm}
          style={styles.closeIconContainer}
        >
          <IonIcons
            name="close-circle"
            color="grey"
            size="25"
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    position: "relative",
    width: "90%",
    height: 50,
    backgroundColor: "#333333",
    borderRadius: 20,
    marginBottom: 20,
    color: "#FFFFFF",
    display: "flex",
    alignSelf: "center",
    marginTop: 70,
    paddingHorizontal: 45,
  },
  searchIcon: {
    position: "absolute",
    top: 83,
    left: 35,
    zIndex: 1,
  },
  closeIconContainer: {
    position: "absolute",
    left: 335,
  },
});
