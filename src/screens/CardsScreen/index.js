import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Cards from './Cards'
import AddItem from './AddItem'
import EditItem from './EditItem'
import { styles as main } from '../../Style'

const CardsNav = createStackNavigator(
  {
    Cards: {
      screen: Cards,
      navigationOptions: () => ({
        title: 'Мои цели',
      })
    },
    AddItem: AddItem,
    EditItem: {
      screen: EditItem,
      navigationOptions: () => ({
        title: 'Редактировать',
      })
    },
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