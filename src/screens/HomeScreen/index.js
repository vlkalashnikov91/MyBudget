import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import HomeScreen from './HomeScreen'
import AddPayment from './AddPayment'
import EditPayment from './EditPayment'

import { styles as main } from '../../Style'


const HomeScreenNav = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    AddPayment: AddPayment,
    EditPayment: {
      screen: EditPayment,
      navigationOptions: () => ({
        title: 'Редактировать',
      })
    },
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