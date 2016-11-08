import React from 'react'
import {
  View,
  Text,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native'

const Styles = require('./styles.js')
const Colors = require('./colors.js')

module.exports = {
  renderBack(navigator, text) {
    if (text != null) {
      if (Platform.OS == 'ios') {
        return (
          <TouchableHighlight onPress={() => navigator.pop()} style={Styles.backTouch} underlayColor={Colors.primary}>
            <View style={Styles.backWrapper}>
              <Image source={require('../img/ic_chevron_left.png')} style={Styles.backChevron} />
              <Text style={Styles.back}>{text}</Text>
            </View>
          </TouchableHighlight>
        )
      } else if (Platform.OS == 'android') {
        return (
          <TouchableHighlight onPress={() => navigator.pop()} style={Styles.backTouch} underlayColor={Colors.primary}>
            <View style={Styles.backWrapper}>
              <Image source={require('../img/ic_arrow_back_white.png')} style={Styles.backChevron} />
            </View>
          </TouchableHighlight>
        )
      }
    }
  }
}
