import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native'

const Colors = require('../values/colors.js')
const Styles = require('../values/styles.js')
const Utils = require('../values/utils.js')

const firebaseApp = require('../values/firebase.js')

const SCREEN_WIDTH = require('Dimensions').get('window').width
const HEADER_WIDTH = 2560
const HEADER_HEIGHT = 1440

export default class VerifyEmailScene extends Component {

  refresh() {
    currentUser = Utils.getUser()
    console.log(currentUser)
    firebaseApp.auth().signOut()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[Styles.headerContainer, { flexDirection: 'row' }]}>
          <Text style={Styles.title}>{this.props.title}</Text>
        </View>
        <Image
          source={require('../img/expertise-3.jpg')}
          style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH / HEADER_WIDTH) * HEADER_HEIGHT }}
        />

        <View style={{ marginLeft: 30, marginRight: 30, marginTop: 50, flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>Verification email has been sent, please check your email.</Text>
        </View>

        <TouchableHighlight onPress={() => this.refresh()} underlayColor='white'
        >
          <Text style={Styles.bottomButton}>Refresh</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
