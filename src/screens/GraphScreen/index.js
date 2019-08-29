import { createStackNavigator } from 'react-navigation'
import Graphics from './Graphics'

const GraphNav = createStackNavigator(
  {
    Graphics: Graphics
  },
  {
    initialRouteName: 'Graphics',
    defaultNavigationOptions: {
      header: null
    },
  }
)

export default GraphNav