import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Registration from './Registration'
import FirstSettings from './FirstSettings'

export const RegNavigator = createStackNavigator(
  {
    Registration: Registration,
    FirstSettings: FirstSettings,
  },
  {
    initialRouteName: 'Registration',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)