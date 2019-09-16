import React from 'react'
import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Category from './Category'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import MonthlyPays from './MonthlyPays'
import AddMonthPay from './AddMonthPay'
import EditMonthPay from './EditMonthPay'
import About from './About'

const ProfileNav = createStackNavigator(
  {
    Profile: Profile,
    ChangePassword: ChangePassword,
    AddCategory: AddCategory,
    EditCategory: EditCategory,
    Category: Category,
    MonthlyPays: MonthlyPays,
    AddMonthPay: AddMonthPay,
    EditMonthPay: EditMonthPay,
    About: About
  },
  {
    initialRouteName: 'Profile',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default ProfileNav