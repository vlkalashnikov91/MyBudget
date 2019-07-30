import React from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Category from './Category'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'

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

    AddCategory: {
      screen: AddCategory,
      navigationOptions: ()=>({
        title: 'Новая категория'
      })
    },

    EditCategory: {
      screen: EditCategory,
      navigationOptions: ()=>({
        title: 'Редактировать'
      })
    },

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