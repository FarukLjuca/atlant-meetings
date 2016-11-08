import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Platform,
  ListView,
  CameraRoll,
  TouchableHighlight
} from 'react-native'

import Room from '../components/room.component.js'

const Styles = require('../values/styles.js')
const Utils = require('../values/utils.js')
const RoomUtils = require('../values/utils.rooms.js')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const firebaseApp = require('../values/firebase.js')

let component

export default class RoomsScene extends Component {

  constructor() {
    super()

    this.state = {
      reservations: null,
      showRightMenu: false
    }
  }

  componentDidMount() {
    component = this

    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (Utils.getProfile()) {
      this.setState({ profileImage: Utils.getProfile() })
    }

    firebaseApp.database().ref('reservations').on('value', function(s) {
      firebaseApp.database().ref('reservations').orderByChild('isRepeat').equalTo(true).once('value', function(snapshot) {
        firebaseApp.database().ref('reservations').orderByChild('endTime').startAt((new Date()).getTime()).endAt(tomorrow.getTime()).once('value', function(notRepeatingSnapshot) {
          let array = []
          let arrayOfIds = []

          snapshot.forEach(function(snap) {
            let reservation = snap.val()
            reservation.id = snap.key
            arrayOfIds.push(snap.key)
            array.push(reservation)
          })

          notRepeatingSnapshot.forEach(function(snap) {
            let reservation = snap.val()
            reservation.id = snap.key
            if (!snap.isRepeat && arrayOfIds.indexOf(snap.key) == -1) array.push(reservation)
          })

          component.setState({ reservations: array })
        })
      })
    })
  }

  openRoomDetails(room) {
    this.props.navigator.push({
      name: 'Room',
      back: 'Rooms',
      data: room
    })
  }

  logout() {
    firebaseApp.auth().signOut().then(function() {
      component.props.navigator.resetTo({ name: 'Init' })
    }, function(error) {
      alert(error.message)
    })
  }

  _renderRightMenu() {
    if (this.state != null && this.state.showRightMenu) {
      return (
        <TouchableHighlight onPress={() => this.setState({ showRightMenu: false })} underlayColor='white' style={Styles.rightMenuOverlay}>
          <View style={Styles.rightMenu}>
            <TouchableHighlight onPress={() => this.logout()} style={Styles.rightMenuTouch} underlayColor='white'>
              <Text style={Styles.rightMenuText}>Logout</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={[Styles.headerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={[Styles.title, { marginLeft: 125 }]}>{this.props.title}</Text>
          <TouchableHighlight onPress={() => this.setState({ showRightMenu: true })} underlayColor='white'>
            <Image source={require('../img/ic_menu.png')} style={{ width: 20, height: 20, margin: 10 }}  />
          </TouchableHighlight>
        </View>
        <ListView
          dataSource={ds.cloneWithRows(RoomUtils.getRooms())}
          renderRow={(room) =>
            <TouchableHighlight onPress={() => this.openRoomDetails(room)} underlayColor='white'>
              <Room room={room} reservations={this.state.reservations} />
            </TouchableHighlight>
          }
        />
        <TouchableHighlight onPress={() => this.props.navigator.push({ name: 'MakeReservation', back: 'Rooms', data: null, edit: null })} underlayColor='white'>
          <Text style={Styles.bottomButton}>Make reservation</Text>
        </TouchableHighlight>
        {this._renderRightMenu()}
      </View>
    )
  }
}
