import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native'

const SCREEN_WIDTH = require('Dimensions').get('window').width

const Colors = require('../values/colors.js')

export default class Room extends Component {
  setNativeProps(props) {
    this._root.setNativeProps(props)
  }

  render() {
    let availableText = 'loading'
    let availableColor = 'gray'

    if (this.props.reservations) {
      let available = true
      const roomId = this.props.room.id
      this.props.reservations.forEach(function(reservation) {
        if (reservation.startDate < new Date().getTime() && reservation.endTime > new Date().getTime() && reservation.roomId == roomId) {
          available = false
        }
      })
      if (available) {
        availableText = 'Available'
        availableColor = Colors.accent
      } else {
        availableText = 'Unavailableafds'
        availableColor = 'red'
      }
    }

    return (
      <View ref={component => this._root = component} style={{ flex: 1, marginBottom: 5, marginTop: 5 }}>
        <View style={{
          borderBottomWidth: 1,
          borderBottomColor: Colors.accent,
          marginBottom: 20,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          padding: 5,
          paddingLeft: 10,
        }}>
          <Text style={{
            fontSize: 20,
            color: Colors.primary
          }}>
            {this.props.room.name}
          </Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', marginBottom: (this.props.room.id == 5 ? 30 : 0) }}>
          <Image style={{ width: SCREEN_WIDTH / 2 - 20, height: (SCREEN_WIDTH / 2) * (150 / 200), marginLeft: 20 }} source={this.props.room.image} />
          <View style={{ marginLeft: 20, width: SCREEN_WIDTH / 2 - 20 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, color: Colors.primary }}>Capacity: </Text>
              <Text style={{ fontSize: 16, color: Colors.primary, fontWeight: 'bold' }}>{this.props.room.capacity}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 16, color: Colors.primary }}>Status: </Text>
              <Text style={{ color: availableColor, fontSize: 16, fontWeight: 'bold' }}>{availableText}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
