import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Login from './Login'
import Registration from './Registration'
import ForgotPass from './ForgotPass'
import FirstSettings from './FirstSettings'

export const LoginNavigator = createStackNavigator(
  {
    Login: Login,
    Registration: Registration,
    ForgotPass: ForgotPass,
    FirstSettings: FirstSettings
  },
  {
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)