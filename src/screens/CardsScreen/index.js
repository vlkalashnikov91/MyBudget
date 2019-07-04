import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Cards from './Cards'
import AddEditItem from './AddEditItem'
import { styles as main } from '../../Style'

const CardsNav = createStackNavigator(
  {
    Cards: {
      screen: Cards,
      navigationOptions: () => ({
        title: 'Мои цели',
      })
    },
    AddEditItem: AddEditItem
  },
  {
    initialRouteName: 'Cards',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
      headerTintColor: 'white'
    }
  }
)

export default CardsNav