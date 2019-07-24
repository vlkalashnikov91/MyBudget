import React from 'react'
import { createBottomTabNavigator} from 'react-navigation'
import { Ionicons } from '@expo/vector-icons'

import CardsNav from './CardsScreen/index.js'
import HomeScreenNav from './HomeScreen/index.js'
import ProfileNav from './ProfileScreen/index.js'
import GraphNav from './GraphScreen/index.js'

import { styles as main, ivanColor } from '../Style'

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Screen1') {
    iconName = `ios-home`
  } else if (routeName === 'Screen2') {
    iconName = `ios-card`
  } else if (routeName === 'Screen3') {
    iconName = `ios-trending-up`
  } else if (routeName === 'Screen4') {
    iconName = `ios-person`
  }

  return <IconComponent name={iconName} size={27} color={tintColor} />;
};


export const HomeNavigator = createBottomTabNavigator(
  {
    Screen1: {
      screen: HomeScreenNav,
    },
    Screen2: {
      screen: CardsNav,
    },
    Screen3: {
      screen: GraphNav,
    },
    Screen4: {
      screen: ProfileNav,
    },
  },
  {
    initialRouteName: 'Screen2',
    contentOptions: {
      itemsContainerStyle: {
        marginVertical: 65
      }
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
    }),
    tabBarOptions: {
      activeTintColor: ivanColor,
      inactiveTintColor: 'gray',
      showLabel: false,
      style: main.bgWhite
    },
  }
)