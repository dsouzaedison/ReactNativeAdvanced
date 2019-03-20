import { createStackNavigator, createAppContainer } from 'react-navigation'
import Profile from '../Containers/Profile'
import Playground from '../Containers/Playground'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator({
  Profile: { screen: Profile },
  Playground: { screen: Playground },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default createAppContainer(PrimaryNav)
