import React, { Component } from 'react'
import { ScrollView, Text, Image, View, SafeAreaView } from 'react-native'
import styled, { ThemeProvider } from 'styled-components'
import { Colors } from 'App/Themes'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import Button from 'App/Components/FullButton'
import { AsyncStorage } from 'react-native'
import firebase from 'react-native-firebase'

// Styles
import styles from './Styles/LaunchScreenStyles'

const ColorText = styled.Text`
  color: ${props => props.theme.colors.fire};
`
export default class LaunchScreen extends Component {
  state = {
    token: '0'
  }

  async componentDidMount () {
    this.checkPermission()
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
          </View>
        </ThemeProvider>
      </View>
    )
  }
}
