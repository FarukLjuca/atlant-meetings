import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  ListView,
  ScrollView
} from 'react-native'

import Reservation from '../components/reservation.component.js'

const Styles = require('../values/styles')
const Colors = require('../values/colors')
const Utils = require('../values/utils')
const ViewUtils = require('../values/utils.view.js')
const firebaseApp = require('../values/firebase.js')

const SCREEN_WIDTH = require('Dimensions').get('window').width;
const SCREEN_HEIGHT = require('Dimensions').get('window').height;
const IMAGE_HEIGHT = SCREEN_WIDTH * (3 / 6);
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

let component
let interval
let reservationsFirebaseListener
let isMounted

export default class RoomScene extends Component {
  constructor() {
    super()

    this.state = {
      reservations: null
    }
  }

  componentDidMount() {
    component = this
    isMounted = true

    let nowPlus7Days = new Date()
    nowPlus7Days.setDate(nowPlus7Days.getDate() + 7)

    firebaseApp.database().ref('reservations').on('value', function(s) {
      if (isMounted) {
        firebaseApp.database().ref('reservations').orderByChild('isRepeat').equalTo(true).once('value', function(snapshot) {
          firebaseApp.database().ref('reservations').orderByChild('endTime').startAt((new Date()).getTime()).endAt(nowPlus7Days.getTime()).once('value', function(notRepeatingSnapshot) {
            let array = []
            let mergedArray = []
            let arrayOfIds = []

            snapshot.forEach(function(snap) {
              let reservation = snap.val()
              reservation.id = snap.key
              arrayOfIds.push(snap.key)
              mergedArray.push(reservation)
            })

            notRepeatingSnapshot.forEach(function(snap) {
              let reservation = snap.val()
              reservation.id = snap.key
              if (!snap.isRepeat && arrayOfIds.indexOf(snap.key) == -1) mergedArray.push(reservation)
            })

            mergedArray.forEach(function(reservation) {
              if (reservation.roomId == component.props.data.id && new Date(reservation.startDate) < nowPlus7Days) {
                if (reservation.repeat == '0') {
                  array.push(reservation)
                } else if (reservation.repeat == '1') {
                  for (let i = 0; i < 7; i++) {
                    let localStart = new Date(reservation.startDate)
                    let localEnd = new Date(reservation.endTime)

                    localStart.setDate(localStart.getDate() + i)
                    localEnd.setDate(localEnd.getDate() + i)

                    if (localStart < nowPlus7Days && (reservation.skip ? reservation.skip : []).indexOf(localStart.getTime()) == -1) {
                      array.push({
                        startDate: localStart.getTime(),
                        endTime: localEnd.getTime(),
                        startDateOrigin: reservation.startDate,
                        endTimeOrigin: reservation.endTime,
                        roomId: reservation.roomId,
                        repeat: reservation.repeat,
                        id: reservation.id,
                        user: reservation.user,
                        skip: reservation.skip
                      })
                    }
                  }
                } else if (reservation.repeat == '7') {
                  let newDate = new Date(reservation.startDate)
                  while (newDate < new Date()) {
                    newDate.setDate(newDate.getDate() + 7)
                  }
                  if ((reservation.skip ? reservation.skip : []).indexOf(newDate.getTime()) == -1) {
                    array.push({
                      startDate: newDate.getTime(),
                      endTime: reservation.endTime,
                      startDateOrigin: reservation.startDate,
                      endTimeOrigin: reservation.endTime,
                      roomId: reservation.roomId,
                      repeat: reservation.repeat,
                      id: reservation.id,
                      user: reservation.user,
                      skip: reservation.skip
                    })
                  }
                } else if (reservation.repeat == '14') {
                  let newDate = new Date(reservation.startDate)
                  while (newDate < new Date()) {
                    newDate.setDate(newDate.getDate() + 14)
                  }
                  if (newDate < nowPlus7Days && (reservation.skip ? reservation.skip : []).indexOf(newDate.getTime()) == -1) {
                    array.push({
                      startDate: newDate.getTime(),
                      endTime: reservation.endTime,
                      startDateOrigin: reservation.startDate,
                      endTimeOrigin: reservation.endTime,
                      roomId: reservation.roomId,
                      repeat: reservation.repeat,
                      id: reservation.id,
                      user: reservation.user,
                      skip: reservation.skip
                    })
                  }
                } else if (reservation.repeat == '30') {
                  let newDate = new Date(reservation.startDate)
                  newDate.setFullYear((new Date()).getFullYear())
                  newDate.setMonth((new Date()).getMonth())

                  if (newDate > new Date() && newDate < nowPlus7Days && (reservation.skip ? reservation.skip : []).indexOf(newDate.getTime()) == -1) {
                    array.push({
                      startDate: newDate.getTime(),
                      endTime: reservation.endTime,
                      startDateOrigin: reservation.startDate,
                      endTimeOrigin: reservation.endTime,
                      roomId: reservation.roomId,
                      repeat: reservation.repeat,
                      id: reservation.id,
                      user: reservation.user,
                      skip: reservation.skip
                    })
                  }
                }
              }
            })

            array = array.sort(component.sortByDate)

            let finalArray = []
            array.forEach(function(snap) {
              if (snap.endTime > new Date()) {
                finalArray.push(snap)
              }
            })

            let dates = []
            finalArray.forEach(function(reservation) {
              let justDate = new Date(reservation.startDate)
              justDate.setHours(0, 0, 0, 0)
              if (dates.indexOf(justDate.getTime()) == -1) {
                dates.push(justDate.getTime())
                reservation.showHeader = true
              } else {
                reservation.showHeader = false
              }
            })

            component.setState({ reservations: finalArray })
          })
        })
      }
    })
  }

  componentWillUnmount() {
    isMounted = false
  }

  sortByDate(a, b) {
    if (new Date(a.startDate) > new Date(b.startDate)) return 1
    else return -1
  }

  _renderListView() {
    if (this.state.reservations) {
      if (this.state.reservations.length == 0) {
        return (
          <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 16, color: Colors.lightGray }}>No reservations for the next week</Text>
        )
      } else {
        return (
          <ListView
            dataSource={ds.cloneWithRows(this.state.reservations)}
            renderRow={(reservation) =>
              <Reservation room={this.props.data} navigator={this.props.navigator} reservation={reservation} />
            }
          />
        )
      }
    } else {
      return (
        <Text style={{ textAlign: 'center', marginTop: 30 }}>Loading</Text>
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView>
          <View>
            <View style={[Styles.headerContainer, { flexDirection: 'row' }]}>
              {ViewUtils.renderBack(this.props.navigator, this.props.back)}
              <Text style={Styles.title}>{this.props.title}</Text>
            </View>
            <Image style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }} source={this.props.data.image} />
            {this._renderListView()}
          </View>
        </ScrollView>
        <TouchableHighlight onPress={() => this.props.navigator.push({ name: 'MakeReservation', back: this.props.data.name, data: this.props.data, edit: null })} underlayColor='white'>
          <Text style={Styles.bottomButton}>Reserve this room</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
