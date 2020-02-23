import React from 'react'
import { createBottomTabNavigator } from 'react-navigation'
import { Ionicons } from '@expo/vector-icons'

import { Text } from 'native-base'

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
    iconName = `ios-paper`
  } else if (routeName === 'Screen2') {
    iconName = `ios-card`
  } else if (routeName === 'Screen3') {
    iconName = `ios-trending-up`
  } else if (routeName === 'Screen4') {
    iconName = `ios-person`
  }

  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const getTabBarLabel = (navigation) => {
  const { routeName } = navigation.state;
  let label;
  if (routeName === 'Screen1') {
    label = `Платежи`
  } else if (routeName === 'Screen2') {
    label = `Цели`
  } else if (routeName === 'Screen3') {
    label = `График`
  } else if (routeName === 'Screen4') {
    label = `Профиль`
  }
  return <Text style={{textAlign:'center', fontSize:12}}>{label}</Text>;
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
    initialRouteName: 'Screen1',
    contentOptions: {
      itemsContainerStyle: {
        marginVertical: 65
      }
    },
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
      tabBarLabel: () => getTabBarLabel(navigation),
    }),
    tabBarOptions: {
      activeTintColor: ivanColor,
      inactiveTintColor: 'gray',
      //showLabel: false,
      style: [main.bgWhite, {borderTopColor:'#ddd', shadowColor:'#000', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.39, shadowRadius: 8.30, elevation: 13}],
      tabStyle:{
        paddingVertical:5
      }
    },
  }
)