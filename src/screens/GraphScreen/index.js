import { createStackNavigator } from 'react-navigation'
import Graphics from './Graphics'
import { styles as main } from '../../Style'


const GraphNav = createStackNavigator(
  {
    Graphics: {
      screen: Graphics,
      navigationOptions: () => ({
        title: 'Графики расходов',
      })
    }
  },
  {
    initialRouteName: 'Graphics',
    defaultNavigationOptions: {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
    },
  }
)

export default GraphNav