import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Category from './Category'
import AddEditCategory from './AddEditCategory'

import { styles as main } from '../../Style'
import About from './About'

const ProfileNav = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ()=>({
        title: 'Мой кабинет'
      })
    },

    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: ()=>({
        title: 'Сменить пароль'
      })
    },

    AddEditCategory: AddEditCategory,
    
    Category: {
      screen: Category,
      navigationOptions: ()=>({
        title: 'Мои категории'
      })
    },
    
    About: {
      screen: About,
      navigationOptions: ()=>({
        title: 'О приложении'
      })
    }
  },
  {
    initialRouteName: 'Profile',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
      headerTintColor: 'white'
    }
  }
)

export default ProfileNav