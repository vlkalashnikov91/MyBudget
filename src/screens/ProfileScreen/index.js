import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Profile from './Profile'
import ChangePassword from './ChangePassword'
import Category from './Category'
import AddEditCategory from './AddEditCategory'

import { styles as main } from '../../Style'

const ProfileNav = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ()=>({
        title: 'Мой кабинет',
        headerStyle: main.bgIvan,
        headerTitleStyle: main.clWhite
      })
    },

    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: ()=>({
        title: 'Сменить пароль',
        headerStyle: main.bgIvan,
        headerTitleStyle: main.clWhite,
        headerTintColor: 'white'
      })
    },

    AddEditCategory: AddEditCategory,
    
    Category: {
      screen: Category,
      navigationOptions: ()=>({
        title: 'Мои категории',
        headerStyle: main.bgIvan,
        headerTitleStyle: main.clWhite,
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