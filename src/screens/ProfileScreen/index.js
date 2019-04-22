import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Category from './Category'
import AddEditCategory from './AddEditCategory'

import { styles as mainStyle } from '../../Style'

const ProfileNav = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ()=>({
        title: 'Мой кабинет',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle
      })
    },

    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: ()=>({
        title: 'Сменить пароль',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
        headerTintColor: 'white'
      })
    },

    AddEditCategory: AddEditCategory,
    
    Category: {
      screen: Category,
      navigationOptions: ()=>({
        title: 'Мои категории',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
        headerTintColor: 'white'
      })
    }
  },
  {
    initialRouteName: 'Profile',
    transitionConfig: () => fromRight()
  }
)

export default ProfileNav