import React from 'react'
import { createSwitchNavigator, createAppContainer } from 'react-navigation'

import { HomeNavigator } from './screens/Navigation'
import { LoginNavigator } from './screens/LoginScreen/index.js'
import { RegNavigator } from './screens/RegScreen/index.js'
import { ForgotPassNavigator } from './screens/ForgotPass/index.js'

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    Home: HomeNavigator,
    Login: LoginNavigator,
    Registration: RegNavigator,
    ForgotPass: ForgotPassNavigator
  },
  {
    initialRouteName: 'Login',
  },
))

export default AppContainer