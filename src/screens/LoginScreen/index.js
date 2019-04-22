import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import { styles as mainStyle } from '../../Style'
import Login from './Login'
import Registration from './Registration'
import ForgotPass from './ForgotPass'
import FirstSettings from './FirstSettings'

export const LoginNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      navigationOptions: ()=>({
        header: null
      })
    },
    Registration: {
      screen: Registration,
      navigationOptions: ()=>({
        title: 'Регистрация',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
        headerTintColor: 'white'
      })
    },
    ForgotPass: {
      screen: ForgotPass,
      navigationOptions: ()=>({
        title: 'Восстановление пароля',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
        headerTintColor: 'white'
      })
    },
    FirstSettings: {
      screen: FirstSettings,
      navigationOptions: () => ({
        headerLeft: null,
        title: 'Добро пожаловать!',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
        headerTintColor: 'white'
      })
    },
  },
  {
    transitionConfig: () => fromRight(),
  }
)