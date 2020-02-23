import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import HomeScreen from './HomeScreen'
import AddPayment from './AddPayment'
import EditPayment from './EditPayment'
import Help from './Help'

const HomeScreenNav = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddPayment: AddPayment,
    EditPayment: EditPayment,
    HelpPayment: Help,
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