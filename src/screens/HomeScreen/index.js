import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import HomeScreen from './HomeScreen'
import AddPayment from './AddPayment'
import EditPayment from './EditPayment'

const HomeScreenNav = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddPayment: AddPayment,
    EditPayment: EditPayment,
  },
  {
    initialRouteName: 'HomeScreen',
    transitionConfig: () => fromRight(),
    defaultNavigationOptions: {
      header: null
    }
  }
)

export default HomeScreenNav