import { createStackNavigator } from 'react-navigation'
import Graphics from './Graphics'

const GraphNav = createStackNavigator(
  {
    Graphics: Graphics,
  },
  {
    initialRouteName: 'Graphics',
  }
)

export default GraphNav