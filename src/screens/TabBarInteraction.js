import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import Animated, {
   useSharedValue,
   useAnimatedStyle,
   useDerivedValue,
   withTiming,
   withSpring,
   withDelay,
   interpolate,
   interpolateColor,
} from 'react-native-reanimated';
import Icon from '../components/common/Icon';

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const IconsComponent = ({ iconsValue, index, item }) => {
   const iconsDerivedValue = useDerivedValue(() => {
      return withDelay(index * 50, withSpring(iconsValue.value));
   });

   const top_interpolate = useDerivedValue(() => {
      return interpolate(iconsDerivedValue.value, [0, 1], [80, 0]);
   });

   const opacity_interpolate = useDerivedValue(() => {
      return interpolate(iconsDerivedValue.value, [0, 1], [0, 1]);
   });

   const animatedStyle = useAnimatedStyle(() => {
      return {
         marginTop: 4,
         top: top_interpolate.value,
         opacity: opacity_interpolate.value,
      };
   });
   return (
      <Animated.View style={[styles.icon, animatedStyle]}>
         <Icon name={item.icon} size={30} resizeMode='contain' />
      </Animated.View>
   );
};

const TabBarInteraction = () => {
   const contHeightValue = useSharedValue(0);
   const iconsValue = useSharedValue(0);
   const circleValue = useSharedValue(0);
   const [first, setfirst] = useState(true);

   const contHeightStyle = useAnimatedStyle(() => {
      const contHeight = interpolate(contHeightValue.value, [0, 1], [110, 300]);
      return {
         height: contHeight,
      };
   });

   const opacity_interpolate = useDerivedValue(() => {
      return interpolate(contHeightValue.value, [0, 1], [1, 0]);
   });

   const rotate_interpolate = useDerivedValue(() => {
      return interpolate(contHeightValue.value, [0, 1], [0, 134]);
   });

   const backgroundColor_interpolate = useDerivedValue(() => {
      return interpolateColor(contHeightValue.value, [0, 1], ['#C3FDC0', '#C8EFB7']);
   });

   const scale_circle_interpolate = useDerivedValue(() => {
      return interpolate(circleValue.value, [0, 0.3], [0, 1]);
   });

   const opacity_circle_interpolate = useDerivedValue(() => {
      return interpolate(circleValue.value, [0, 1], [1, 0]);
   });

   const iconPlusStyle = useAnimatedStyle(() => {
      return {
         position: 'absolute',
         bottom: 12,
         // opacity: opacity_interpolate.value,
         backgroundColor: backgroundColor_interpolate.value,
         transform: [
            {
               rotate: `${rotate_interpolate.value}deg`,
            },
         ],
      };
   });

   const iconCircleStyle = useAnimatedStyle(() => {
      return {
         transform: [
            {
               scale: scale_circle_interpolate.value,
            },
         ],
         opacity: opacity_circle_interpolate.value,
      };
   });
   const onFocus = () => {
      setfirst(false);
      contHeightValue.value = withTiming(1, { duration: 300 });
      iconsValue.value = withTiming(1, { duration: 50 });
      circleValue.value = withTiming(1, { duration: 300 });
   };

   const onBlur = () => {
      contHeightValue.value = withTiming(0, { duration: 250 });
      iconsValue.value = withTiming(0, { duration: 1 });
      circleValue.value = 0;
      if (!first) {
         setfirst(true);
      }
   };
   return (
      <View style={styles.container}>
         <AnimatedButton style={[styles.button, contHeightStyle]} onPress={onFocus}>
            <View style={{ marginTop: 10 }}>
               {[{ icon: 'chat' }, { icon: 'chat' }].map((item, index) => {
                  return <IconsComponent key={index} {...{ iconsValue, index, item }} />;
               })}
            </View>
            <Animated.View style={[styles.plusCont, iconPlusStyle]}>
               <View style={[styles.plusLine1, { backgroundColor: first ? 'black' : '#F36C65' }]} />
               <View style={[styles.plusLine, { backgroundColor: first ? 'black' : '#F36C65' }]} />
            </Animated.View>
         </AnimatedButton>
         <Animated.View style={[styles.circle, iconCircleStyle]} />
         <Pressable onPress={onBlur}>
            <Image
               source={require('../../assets/navigation.png')}
               resizeMode='contain'
               style={styles.image}
            />
         </Pressable>

         {/* <Pressable onPress={onBlur} style={styles.onBlur} /> */}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
   },
   button: {
      width: 110,
      height: 110,
      borderRadius: 100,
      backgroundColor: '#C3FDC0',
      alignItems: 'center',
      position: 'absolute',
      bottom: '47.3%',
      overflow: 'hidden',
      zIndex: 1000,
      marginLeft: 1.8,
   },

   onBlur: {
      backgroundColor: 'white',
      width: 200,
      height: 90,
      borderRadius: 30,
      position: 'absolute',
      bottom: '41%',
   },
   text: {
      fontSize: 30,
      color: 'white',
   },
   icon: {
      width: 85,
      height: 85,
      backgroundColor: '#B2E7B0',
      borderRadius: 100,
      marginBottom: 6,
      alignItems: 'center',
      justifyContent: 'center',
   },
   circle: {
      backgroundColor: 'rgba(242, 36, 36, 0.4)',
      width: 40,
      height: 40,
      position: 'absolute',
      borderRadius: 40,
      bottom: '50%',
      zIndex: 1000,
   },
   image: {
      width: 560,
      height: 200,
   },
   plusLine: {
      position: 'absolute',
      width: 30,
      height: 4,
      transform: [
         {
            rotate: 90 + 'deg',
         },
      ],
      borderRadius: 4,
   },
   plusLine1: {
      width: 30,
      height: 4,
      borderRadius: 4,
   },
   plusCont: {
      width: 85,
      height: 85,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
   },
});

export default TabBarInteraction;