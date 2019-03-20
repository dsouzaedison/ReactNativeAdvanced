import React, { Component } from 'react'
import { View, Animated, Image, PanResponder, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ProfileStyle'

const {width, height} = Dimensions.get('window')

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size: new Animated.Value(40)
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (gesture.dy > 0 && this.state.size._value < width) {
          this.state.size.setValue(40 + gesture.dy)
        }
      },
      onPanResponderRelease: (event, gesture) => {
        const toValue = gesture.dy > 75 ? width : 40
        Animated.spring(this.state.size, {
          toValue
        }).start()
      }
    })
  }

  openImage = () => {
    if (this.state.size._value === width) {
      Animated.timing(this.state.size, {
        toValue: 40,
        duration: 200,
        userNativeDriver: true
      }).start()
    } else {
      Animated.timing(this.state.size, {
        toValue: width,
        duration: 200,
        userNativeDriver: true
      }).start()
    }

  }

  render () {
    // const profileImage = {
    //   height: 40,
    //   width: 40,
    //   borderRadius: 20
    // }

    const interpolateRadius = this.state.size.interpolate({
      inputRange: [40, width],
      outputRange: [20, 0],
      extrapolate: 'clamp'
    })

    const profileImage = {
      height: this.state.size,
      width: this.state.size,
      borderRadius: interpolateRadius
      // borderRadius: Animated.divide(this.state.size, 2)
    }

    return (
      <View style={[styles.mainContainer, {justifyContent: 'center', alignItems: 'center'}]}>
        <Text h4>Profile Container</Text>
        <Animated.View {...this.panResponder.panHandlers}>
          <TouchableWithoutFeedback onPress={this.openImage}>
            <Animated.Image style={profileImage}
                            source={{uri: 'https://static.makeuseof.com/wp-content/uploads/2015/11/perfect-profile-picture-all-about-face.jpg'}}/>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
