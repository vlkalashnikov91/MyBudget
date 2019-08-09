import { createStackNavigator } from 'react-navigation'
import { fromBottom } from 'react-navigation-transitions'

import Graphics from './Graphics'
import Filter from './Filter'
import { styles as main } from '../../Style'


const GraphNav = createStackNavigator(
  {
    Graphics: {
      screen: Graphics,
      navigationOptions: () => ({
        title: 'Графики расходов',
      })
    },
    Filter: Filter,
  },
  {
    initialRouteName: 'Graphics',
    transitionConfig: () => fromBottom(),
    defaultNavigationOptions: {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
    },
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: navigation.state.index < 1,
    })
  }
)

export default GraphNav