import { createStackNavigator } from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'

import Cards from './Cards'
import AddEditItem from './AddEditItem'

import { styles as mainStyle } from '../../Style'

const CardsNav = createStackNavigator(
  {
    Cards: {
      screen: Cards,
      navigationOptions: () => ({
        title: 'MyBudget',
        headerStyle: mainStyle.headerStyle,
        headerTitleStyle: mainStyle.headerTitleStyle,
      })
    },
    AddEditItem: AddEditItem
  },
  {
    initialRouteName: 'Cards',
    transitionConfig: () => fromRight()
  }
)

export default CardsNav