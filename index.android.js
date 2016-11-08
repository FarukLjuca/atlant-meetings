import React, { Component } from 'react'
import {
  AppRegistry,
  Navigator,
  BackAndroid,
  TouchableHighlight,
  Text,
  View
} from 'react-native'

import LoadingScene from './app/scenes/loading.scene.js'
import LoginScene from './app/scenes/login.scene.js'
import RegisterScene from './app/scenes/register.scene.js'
import VerifyEmailScene from './app/scenes/verify_email.scene.js'
import ResetPasswordScene from './app/scenes/reset_password.scene.js'
import RoomsScene from './app/scenes/rooms.scene.js'
import RoomScene from './app/scenes/room.scene.js'
import MakeReservationScene from './app/scenes/make_reservation.scene.js'

const SCREEN_WIDTH = require('Dimensions').get('window').width
const FloatFromRight = {
  ...Navigator.SceneConfigs.FloatFromRight,
  gestures: {
    pop: {
      ...Navigator.SceneConfigs.FloatFromRight.gestures.pop,
      edgeHitWidth: SCREEN_WIDTH / 2,
    },
  },
}
const Utils = require('./app/values/utils.js')
const firebaseApp = require('./app/values/firebase.js')

let component, navigator

export default class AtlantMeetings extends Component {
  constructor() {
    super()

    this.state = {
      loggedIn: false,
      emailVerified: false,
      loading: true
    }
  }

  componentDidMount() {
    component = this

    firebaseApp.auth().onAuthStateChanged(function(currentUser) {
      if (currentUser != null) {
        if (!currentUser.emailVerified) {
          currentUser.sendEmailVerification()
          component.setState({ loggedIn: true, loading: false })
        } else {
          component.setState({ loading: false, loggedIn: true, emailVerified: true })
        }
      } else {
        component.setState({ loading: false, loggedIn: false, emailVerified: false })
      }

      Utils.setUser(currentUser)
    })
  }

  render() {
    return (
      <Navigator
        ref={(nav) => { navigator = nav }}
        configureScene={() => FloatFromRight}
        style={{ flex: 1 }}
        initialRoute={{ name: 'Init' }}
        configureScene={(route) => ({
          ...Navigator.SceneConfigs.HorizontalSwipeJump,
          gestures: false
        })}
        renderScene={(route, navigator) => {
          // If user is not loged in - log in
          // If user has reservations - reservations
          // If user has no reservations - rooms

          if (route.name == 'Init') {
            if (this.state.loading) {
              return <LoadingScene navigator={navigator} />
            } else if (this.state.loggedIn) {
              if (!this.state.emailVerified) {
                return <VerifyEmailScene navigator={navigator} title='Email Verification' />
              } else {
                return <RoomsScene navigator={navigator} title='Rooms' />
              }
            } else {
              return <LoginScene navigator={navigator} title='Login' />
            }
          } else if (route.name == 'Login') {
            return <LoginScene navigator={navigator} title='Login' back={route.back} />
          } else if (route.name == 'Register') {
            return <RegisterScene navigator={navigator} title='Register' back={route.back} />
          } else if (route.name == 'Verify Email') {
            return <VerifyEmailScene navigator={navigator} title='Verify Email' back={route.back} />
          } else if (route.name == 'ResetPassword') {
            return <ResetPasswordScene navigator={navigator} title='Reset Password' back={route.back} />
          } else if (route.name == 'Rooms') {
            return <RoomsScene navigator={navigator} title='Rooms' back={route.back} />
          } else if (route.name == 'Room') {
            return <RoomScene navigator={navigator} title={route.data.name} back={route.back} data={route.data} />
          } else if (route.name == 'MakeReservation') {
            return <MakeReservationScene navigator={navigator} title='Make Reservation' back={route.back} data={route.data} edit={route.edit} />
          }
        }}
      />
    )
  }
}

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop()
    return true
  }
  return false
})

AppRegistry.registerComponent('v4_atlant_meetings', () => AtlantMeetings)
