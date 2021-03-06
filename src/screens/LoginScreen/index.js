import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Login from './Login'

export const LoginNavigator = createStackNavigator(
  {
    Login: Login,
  },
  {
    initialRouteName: 'Login',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)