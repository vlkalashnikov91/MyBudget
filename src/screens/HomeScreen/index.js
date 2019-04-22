import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import HomeScreen from './HomeScreen'
import AddEditPayment from './AddEditPayment'

const HomeScreenNav = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddEditPayment: AddEditPayment,
  },
  {
    initialRouteName: 'HomeScreen',
    transitionConfig: () => fromRight()
  }
)

export default HomeScreenNav