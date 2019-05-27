import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import HomeScreen from './HomeScreen'
import AddEditPayment from './AddEditPayment'

import { styles as main } from '../../Style'


const HomeScreenNav = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddEditPayment: AddEditPayment,
  },
  {
    initialRouteName: 'HomeScreen',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
      headerTintColor: 'white'
    }
  }
)

export default HomeScreenNav