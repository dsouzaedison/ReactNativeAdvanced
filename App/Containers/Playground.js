import React, { Component } from 'react'
import {
  Button,
  ScrollView,
  View,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  PanResponder
} from 'react-native'
import { connect } from 'react-redux'
import { Card, Text } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'

const {width, height} = Dimensions.get('window')

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PlaygroundStyle'

class Playground extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animation: new Animated.Value(0),
      opacity: new Animated.Value(1),
      position: new Animated.ValueXY(),
    }

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => {
        // this.state.position.setValue({
        //   x: this.state.position.x._value,
        //   y: this.state.position.y._value
        // })
        return true
      },
      onPanResponderMove: (evt, gesture) => {
        console.log(JSON.stringify(gesture, 0, 4))
        this.state.position.setValue({x: gesture.dx, y: gesture.dy})
      },
      onPanResponderRelease: () => {}
    })
  }

  fade = () => {
    this.state.animation.setValue(0)
    this.state.opacity.setValue(1)
    Animated.timing(this.state.animation, {
      toValue: 100,
      duration: 300
    }).start(({finished}) => {
      Animated.spring(this.state.opacity, {
        toValue: 0
      }).start()
      // this.state.animation.setValue(0)
      // Animated.timing(this.state.animation, {
      //   toValue: 0,
      //   duration: 300
      // }).start()
    })
  }

  render () {
    const styles = {
      button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        height: 40,
        flex: 1
      }
    }

    const interpolateX = this.state.animation.interpolate({
      inputRange: [0, 30, 60, 100],
      outputRange: [10, 20, 30, 10]
    })

    const interpolateWidth = this.state.animation.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp'
    })

    const interpolateColor = this.state.animation.interpolate({
      inputRange: [0, 50, 80],
      outputRange: ['yellow', 'teal', 'orange']
    })

    const animatedStyles = {
      transform: [
        {
          translateX: this.state.position.x
        },
        {
          translateY: this.state.position.y
        }
      ]
    }

    return (
      <ScrollView style={styles.mainContainer}>
        <Text h4 style={{color: 'red'}}>Playground Container</Text>
        {
          this.props.list.map((item, i) => {
            const CardJSX = (
              <Card key={item} title={item.toUpperCase()}>
                <Text>Description goes here...</Text>
                <TouchableOpacity
                  onPress={this.fade}
                  style={styles.button}>
                  <React.Fragment>
                    <Animated.View style={[StyleSheet.absoluteFill, {
                      backgroundColor: interpolateColor,
                      width: interpolateWidth,
                      opacity: this.state.opacity,
                      height: 5,
                      top: null,
                      bottom: 0
                    }]}/>
                    <Text>Click Me</Text>
                  </React.Fragment>
                </TouchableOpacity>
              </Card>
            )



            if (i === 0) {
              return (
                <Animated.View key={item} style={animatedStyles} {...this.panResponder.panHandlers}>
                  {CardJSX}
                </Animated.View>
              )
            } else {
              return CardJSX
            }
          })
        }
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => ({
  list: state.search.results.slice(0, 11)
})

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Playground)
