import React, { Component } from 'react'
import { ScrollView, Text, Image, View, SafeAreaView, Alert } from 'react-native'
import styled, { ThemeProvider } from 'styled-components'
import { Colors } from 'App/Themes'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import Button from 'App/Components/FullButton'
import { AsyncStorage } from 'react-native'
import firebase from 'react-native-firebase'

// Styles
import styles from './Styles/LaunchScreenStyles'
import dataExtractor from '../Services/dataExtractor'

const ColorText = styled.Text`
  color: ${props => props.theme.colors.fire};
`
export default class LaunchScreen extends Component {
  state = {
    token: '0',
    newMessage: false,
    payload: null,
    notificationOpen: null
  }

  async componentDidMount () {
    this.checkPermission()
    this.createNotificationListeners()

    let payload = await AsyncStorage.getItem('payload')

    if(payload) {
      this.setState({
        payload: JSON.parse(payload)
      })
    }
  }

  handleNotification = async (message, from) => {
    // console.log(JSON.stringify(message, 0, 4))

    await dataExtractor(message, from)

    this.setState({
      payload: message.data
    })
  }

  createNotificationListeners = async () => {
    // 1. foreground
    this.notificationListener = firebase.notifications().onNotification(async message => this.handleNotification(message, 'foreground'));

    // 2. background - clicked / tapped / opened (Not working - https://github.com/invertase/react-native-firebase/issues/1190)
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async message => this.handleNotification(message, 'background - click'));

    // 3. closed - clicked / tapped / opened (Not working - https://github.com/invertase/react-native-firebase/issues/1190)
    // Possible Solution - (https://github.com/invertase/react-native-firebase/issues/1027#issuecomment-390557446)
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.setState({
        notificationOpen: notificationOpen.notification
      })
      this.handleNotification(notificationOpen, 'closed - click')
    }

    // 4. foreground - data only
    this.messageListener = firebase.messaging().onMessage((message) => this.handleNotification(message, 'foreground - data only'));
  }

  showAlert = (title, body) => {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  // 1
  checkPermission = async  () => {
    const enabled = await firebase.messaging().hasPermission()
    if (enabled) {
      this.getToken()
    } else {
      this.requestPermission()
    }
  }

  // 3
  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log('fcmToken async: ' + fcmToken)

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken()
    }

    if (fcmToken) {
      // user has a device token
      this.setState({
        token: fcmToken
      })

      console.log('fcmToken: ' + fcmToken)
      await AsyncStorage.setItem('fcmToken', fcmToken)
    }
  }

  // 2
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission()
      // User has authorised
      this.getToken()
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected')
    }
  }

  render () {
    const theme = {
      colors: Colors
    }

    return (
      <View style={styles.mainContainer}>
        <ThemeProvider theme={theme}>
          <View>
            <ColorText>Hello</ColorText>
            <Button onPress={() => this.props.navigation.navigate('Playground')} text='Open Playground'/>
            <Button onPress={() => this.props.navigation.navigate('Profile')} text='Open Profile'/>
            <Text>Token: {this.state.token}</Text>
            {
              this.state.payload &&
                <Text>{JSON.stringify(this.state.payload, 0, 4)}</Text>
            }
          </View>
        </ThemeProvider>
      </View>
    )
  }
}
