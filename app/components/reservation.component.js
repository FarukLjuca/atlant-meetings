import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

const Colors = require('../values/colors.js')
const Utils = require('../values/utils.js')
const DateUtils = require('../values/utils.date.js')
const firebaseApp = require('../values/firebase.js')

export default class Reservation extends Component {
  setNativeProps(props) {
    this._root.setNativeProps(props)
  }

  getFullMinutes(minutes) {
    if (minutes < 10) {
      return '0' + minutes
    }
    return minutes
  }

  deleteReservation(reservation) {
    if (reservation.repeat == '0') {
      Alert.alert(
        'Delete reservation',
        'Are you sure that you want to delete this reservation?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete', onPress: () => firebaseApp.database().ref('reservations/' + reservation.id).remove(), style: 'destructive'}
        ]
      )
    } else {
      Alert.alert(
        'Delete reservation',
        'This is reocuring reservation, do you want to delete all instances or just this one?',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Delete this one', onPress: () => {
            let newSkip = reservation.skip

            if (newSkip) {
              newSkip.push(reservation.startDate)
            } else {
              newSkip = [reservation.startDate]
            }

            console.log(newSkip)

            firebaseApp.database().ref('reservations/' + reservation.id).set({
              startDate: reservation.startDateOrigin,
              endTime: reservation.endTimeOrigin,
              repeat: reservation.repeat,
              roomId: reservation.roomId,
              user: reservation.user,
              skip: newSkip
            })
          }, style: 'default'},
          {text: 'Delete all', onPress: () => firebaseApp.database().ref('reservations/' + reservation.id).remove(), style: 'destructive'}
        ]
      )
    }
  }

  editReservation(reservation) {
    this.props.navigator.push({
      name: 'MakeReservation',
      back: this.props.room.name,
      data: this.props.room,
      edit: reservation
    })
  }

  _renderHeader() {
    if (this.props.reservation.showHeader) {
      return (
        <View style={styles.containerHeader}>
          <Text style={styles.textHeader}>
            {
              DateUtils.getDayText(new Date(this.props.reservation.startDate)) +
              ' ' +
              new Date(this.props.reservation.startDate).getDate() +
              '. ' +
              DateUtils.getMonthText(new Date(this.props.reservation.startDate).getMonth()) +
              ' ' +
              new Date(this.props.reservation.startDate).getFullYear() +
              '.'
            }
          </Text>
        </View>
      )
    } else return null
  }

  _renderDeleteReservation() {
    if (this.props.reservation.user == Utils.getUser().email) {
      return(
        <TouchableHighlight
          style={{ marginRight: 10 }}
          underlayColor='white'
          onPress={() => this.deleteReservation(this.props.reservation)}
        >
          <Image source={require('../img/ic_close.png')} style={{ width: 18, height: 18 }} />
        </TouchableHighlight>
      )
    }
  }

  _renderEditReservation() {
    if (this.props.reservation.user == Utils.getUser().email) {
      return(
        <TouchableHighlight
          style={{ marginRight: 10 }}
          underlayColor='white'
          onPress={() => this.editReservation(this.props.reservation)}
        >
          <Image source={require('../img/ic_mode_edit.png')} style={{ width: 18, height: 18 }} />
        </TouchableHighlight>
      )
    }
  }

  render() {
    return (
      <View ref={component => this._root = component} style={styles.container}>
        {this._renderHeader()}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ padding: 10 }}>
            <Text style={styles.textStartTime}>
              {
                new Date(this.props.reservation.startDate).getHours() +
                ':' +
                this.getFullMinutes(new Date(this.props.reservation.startDate).getMinutes()) +
                ' - ' +
                new Date(this.props.reservation.endTime).getHours() +
                ':' +
                this.getFullMinutes(new Date(this.props.reservation.endTime).getMinutes())
              }
            </Text>
          </View>
          <Text style={styles.textName}>
            {this.props.reservation.user.substr(0, this.props.reservation.user.indexOf('@')).replace(/\b\w/g, l => l.toUpperCase()).replace('.', ' ')}
          </Text>
          <View style={{ flex: 1 }} />
          {this._renderEditReservation()}
          {this._renderDeleteReservation()}
        </View>
      </View>
    )
  }
}

const styles = new StyleSheet.create({
  textName: {
    marginLeft: 10
  },
  textStartTime: {
    fontSize: 12,
    textAlign: 'right',
    minWidth: 80
  },
  textEndTime: {
    fontSize: 12,
    marginTop: 5,
    color: 'gray',
    textAlign: 'right'
  },
  containerHeader: {
    marginTop: 10,
    marginRight: 5,
    marginLeft: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent
  },
  textHeader: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    color: Colors.primary
  }
})
