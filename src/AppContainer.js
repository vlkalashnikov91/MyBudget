import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import { HomeNavigator } from './screens/Navigation'
import { LoginNavigator } from './screens/LoginScreen/index.js'

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    Home: HomeNavigator,
    Login: LoginNavigator,
  },
  {
    initialRouteName: 'Login'
  },
))

export default AppContainer