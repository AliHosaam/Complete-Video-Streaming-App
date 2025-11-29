import { useRef, useState } from "react";
import { View, TouchableWithoutFeedback, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const DoubleTap = ({ position, onDoubleTap }) => {
  const [forwardCount, setForwardCount] = useState(0);
  const [backwardsCount, setBackwardsCount] = useState(0);

  const lastTap = useRef(0);
  const DOUBLE_TAP_DELAY = 300;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const triggerNetflixAnimation = () => {
    scale.value = 0.7;
    opacity.value = 1;

    scale.value = withSequence(
      withTiming(1.15, { duration: 120 }),
      withTiming(1.0, { duration: 120 })
    );

    opacity.value = withDelay(350, withTiming(0, { duration: 200 }));

    scale.value = withDelay(350, withTiming(0.85, { duration: 200 }));

    setTimeout(() => {
      setForwardCount(0);
      setBackwardsCount(0);
    }, 1000);
  };

  const handleTap = () => {
    const now = Date.now();

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (position === "left") {
        setBackwardsCount((prev) => prev - 10);
      } else {
        setForwardCount((prev) => prev + 10);
      }

      triggerNetflixAnimation();
      onDoubleTap();
    }

    lastTap.current = now;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const positionStyle = position === "left" ? styles.left : styles.right;

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={[styles.innerView, positionStyle]}>
        <Animated.View style={[styles.indicatorContainer, animatedStyle]}>
          <Text style={styles.indicatorText}>
            {position === "left" ? `${backwardsCount}s` : `+${forwardCount}s`}
          </Text>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  innerView: {
    position: "absolute",
    top: 50,
    bottom: 100,
    width: 180,
    marginTop: 150,
  },
  left: {
    left: 120,
  },
  right: {
    right: 120,
  },
  indicatorContainer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    alignSelf: "center",
  },
  indicatorText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default DoubleTap;
