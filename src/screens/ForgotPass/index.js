import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import ForgotPass from './ForgotPass'
import ForgotPassInfo from './ForgotPassInfo'

export const ForgotPassNavigator = createStackNavigator(
  {
    ForgotPass: ForgotPass,
    ForgotPassInfo: ForgotPassInfo,
  },
  {
    initialRouteName: 'ForgotPass',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)