import React, { Component } from 'react'
import {
  View,
  Image
} from 'react-native'

const Colors = require('../values/colors.js')

export default class LoadingScene extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../img/loading.gif')} style={{ width: 200, height: 200 }} />
      </View>
    )
  }
}
