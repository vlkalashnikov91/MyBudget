import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Cards from './Cards'
import AddItem from './AddItem'
import EditItem from './EditItem'
import Help from './Help'

const CardsNav = createStackNavigator(
  {
    Cards: Cards,
    AddItem: AddItem,
    EditItem: EditItem,
    HelpCard: Help,
  },
  {
    initialRouteName: 'Cards',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default CardsNav