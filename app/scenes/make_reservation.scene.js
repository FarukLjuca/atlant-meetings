import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Switch,
  Picker,
  Platform,
  ListView,
  ScrollView,
  StyleSheet,
  BackAndroid,
  DatePickerIOS,
  DatePickerAndroid,
  TimePickerAndroid,
  TouchableHighlight
} from 'react-native'

const Styles = require('../values/styles')
const Utils = require('../values/utils')
const Colors = require('../values/colors')
const DateUtils = require('../values/utils.date')
const ViewUtils = require('../values/utils.view')
const RoomsUtils = require('../values/utils.rooms')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const firebaseApp = require('../values/firebase.js')

let component
let isMounted

export default class MakeReservationScene extends Component {

  constructor() {
    super()

    let endTime = new Date()
    endTime.setMinutes(endTime.getMinutes() + 5)

    this.state = {
      title: null,
      reservations: null,
      startDate: new Date(),
      endTime: endTime,
      selectedRoom: null,
      showStartDate: false,
      showEndTime: false,
      repeat: '0',
      allDay: false,
      edit: null
    }
  }

  componentDidMount() {
    component = this
    isMounted = true

    if (this.props.edit) {
      this.setState({
        startDate: new Date(this.props.edit.startDate),
        endTime: new Date(this.props.edit.endTime),
        repeat: this.props.edit.repeat,
        edit: this.props.edit,
        selectedRoom: this.props.data,
        title: 'Edit Reservation'
      })
    } else {
      this.setState({
        selectedRoom: this.props.data,
        title: 'Make Reservation'
      })
    }

    let nowPlus7Days = new Date()
    nowPlus7Days.setDate(nowPlus7Days.getDate() + 7)

    firebaseApp.database().ref('reservations').on('value', function(s) {
      if (isMounted) {
        firebaseApp.database().ref('reservations').orderByChild('isRepeat').equalTo(true).once('value', function(snapshot) {
          firebaseApp.database().ref('reservations').orderByChild('endTime').startAt((new Date()).getTime()).once('value', function(notRepeatingSnapshot) {
            let array = []

            notRepeatingSnapshot.forEach(function(snap) {
              let reservation = snap.val()
              reservation.id = snap.key
              if (!reservation.isRepeat) array.push(reservation)
            })

            snapshot.forEach(function(snap) {
              let reservation = snap.val()
              reservation.id = snap.key
              array.push(reservation)
            })

            component.setState({ reservations: array })
          })
        })
      }
    })
  }

  componentWillUnmount() {
    isMounted = false
  }

  chooseStartDate = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.startDate,
        minDate: new Date()
      })

      if (action !== TimePickerAndroid.dismissedAction) {
        let newStartDate = new Date(this.state.startDate.getTime())
        newStartDate.setFullYear(year)
        newStartDate.setMonth(month - 1)
        newStartDate.setDate(day)
        // We need to do this because of wierd functioning of time zones
        newStartDate.setMonth(newStartDate.getMonth() + 1)

        this.setState({ startDate: newStartDate })
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  _renderStartDateTile() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight underlayColor='white' onPress={() => this.setState({showStartDate: !this.state.showStartDate})}>
          <View style={styles.option}>
            <Text>Start date</Text>
            <View style={{ flex: 1 }} />
            <Text>{DateUtils.getDateText(this.state.startDate) + ' ' + DateUtils.getTimeText(this.state.startDate)}</Text>
          </View>
        </TouchableHighlight>
      )
    } else if (Platform.OS == 'android') {
      return (
        <TouchableHighlight underlayColor='white' onPress={this.chooseStartDate.bind(this)}>
          <View style={styles.option}>
            <Text>Start date</Text>
            <View style={{ flex: 1 }} />
            <Text>{DateUtils.getDateText(this.state.startDate)}</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  _renderStartDatePicker() {
    if (Platform.OS == 'ios' && this.state.showStartDate) {
      return (
        <DatePickerIOS
          style={{ margin: 10 }}
          mode='datetime'
          date={this.state.startDate}
          minimumDate={new Date()}
          onDateChange={(startDate) => {
            let endDate = DateUtils.setFullDate(this.state.endTime,
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate())

            endDate.setMinutes(endDate.getMinutes() - 5)
            if (startDate < new Date()) {
              let newEndTime = new Date()
              newEndTime.setMinutes(newEndTime.getMinutes() + 5)
              this.setState({ startDate: new Date(), endTime: newEndTime })
            } else if (endDate < startDate) {
              let newEndTime = new Date(startDate)
              newEndTime.setMinutes(newEndTime.getMinutes() + 5)
              this.setState({ startDate: startDate, endTime: newEndTime })
            } else {
              this.setState({startDate: startDate})
            }
          }}
        />
      )
    }
  }

  chooseStartTime = async () => {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({
        hour: this.state.startDate.getHours(),
        minute: this.state.startDate.getMinutes(),
        is24Hour: true
      })

      if (action !== TimePickerAndroid.dismissedAction) {
        let newStartDate = new Date(this.state.startDate.getTime())
        newStartDate.setHours(hour)
        newStartDate.setMinutes(minute + 5)

        newEndTime = new Date(this.state.endTime)
        newEndTime.setFullYear(newStartDate.getFullYear())
        newEndTime.setMonth(newStartDate.getMonth())
        newEndTime.setDate(newStartDate.getDate())

        if (newStartDate > newEndTime) {
          this.setState({ endTime: newStartDate })
        }

        let finalStartDate = new Date(newStartDate.getTime())
        finalStartDate.setMinutes(finalStartDate.getMinutes() - 5)
        this.setState({ startDate: finalStartDate })
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  _renderStartTimeTile() {
    if (Platform.OS == 'android') {
      return (
        <TouchableHighlight underlayColor='white' onPress={this.chooseStartTime.bind(this)}>
          <View style={[styles.option, { borderTopWidth: 1, borderTopColor: 'lightgray' }]}>
            <Text>Start time</Text>
            <View style={{ flex: 1 }} />
            <Text>{DateUtils.getTimeText(this.state.startDate)}</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  chooseEndTime = async () => {
    try {
      const {action, minute, hour} = await TimePickerAndroid.open({
        hour: this.state.endTime.getHours(),
        minute: this.state.endTime.getMinutes(),
        is24Hour: true
      })

      if (action !== TimePickerAndroid.dismissedAction) {
        let newEndTime = new Date(this.state.endTime.getTime())
        newEndTime.setHours(hour)
        newEndTime.setMinutes(minute)

        let startDate = new Date(this.state.startDate.getTime())
        startDate.setMinutes(startDate.getMinutes() + 5)

        if (startDate < newEndTime)
          this.setState({ endTime: newEndTime })
        else
          this.setState({ endTime: startDate })
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  _renderEndTimeTile() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight underlayColor='white' onPress={() => this.setState({showEndTime: !this.state.showEndTime})}>
          <View style={[styles.option, { borderTopWidth: 1, borderTopColor: Colors.accent }]}>
            <Text>End time</Text>
            <View style={{ flex: 1 }} />
            <Text>{DateUtils.getTimeText(this.state.endTime)}</Text>
          </View>
        </TouchableHighlight>
      )
    } else if (Platform.OS == 'android') {
      return (
        <TouchableHighlight underlayColor='white' onPress={this.chooseEndTime.bind(this)}>
          <View style={[styles.option, { borderTopWidth: 1, borderTopColor: Colors.accent }]}>
            <Text>End time</Text>
            <View style={{ flex: 1 }} />
            <Text>{DateUtils.getTimeText(this.state.endTime)}</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  _renderEndTimePicker() {
    if (Platform.OS == 'ios' && this.state.showEndTime) {
      return (
        <DatePickerIOS
          style={{ margin: 10 }}
          mode='time'
          date={this.state.endTime}
          onDateChange={(endDate) => {
            let newEndDate = DateUtils.setFullDate(endDate,
              this.state.startDate.getFullYear(),
              this.state.startDate.getMonth(),
              this.state.startDate.getDate())

            newEndDate.setMinutes(newEndDate.getMinutes() - 5)
            if (newEndDate < this.state.startDate) {
              let minTime = new Date(this.state.startDate.getTime())
              minTime.setMinutes(minTime.getMinutes() + 5)
              this.setState({ endTime: minTime })
            } else {
              newEndDate.setMinutes(newEndDate.getMinutes() + 5)
              this.setState({ endTime: newEndDate })
            }
          }}
        />
      )
    }
  }

  _renderChecked(room) {
    if (this.state.selectedRoom != null && room.id == this.state.selectedRoom.id) {
      return (
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, right: 0, height: 100 }}>
          <Image style={{ width: 30, height: 30 }} source={require('../img/ic_check.png')} />
        </View>
      )
    }
  }

  _renderRepeatTile() {
    return (
      <TouchableHighlight underlayColor='white' onPress={() => this.setState({showRepeat: !this.state.showRepeat})}>
        <View style={[styles.option, { borderTopWidth: 1, borderTopColor: Colors.accent }]}>
          <Text>Repeat</Text>
          <View style={{ flex: 1 }} />
          <Text>{DateUtils.getRepeatText(this.state.repeat)}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderRepeat() {
    if (this.state.showRepeat && Platform.OS == 'ios') {
      return (
        <Picker
          style={{ marginLeft: 15, marginRight: 15 }}
          selectedValue={this.state.repeat}
          onValueChange={(repeat) => this.setState({repeat: repeat})}>
          <Picker.Item label='One time' value='0' />
          <Picker.Item label='Every day' value='1' />
          <Picker.Item label='Every week' value='7' />
          <Picker.Item label='Every two weeks' value='14' />
          <Picker.Item label='Every month' value='30' />
        </Picker>
      )
    }
  }

  setRepeat(repeat) {
    this.setState({ repeat: repeat, showRepeat: false })
  }

  _renderRepeatAndroid() {
    if (this.state.showRepeat && Platform.OS == 'android') {
      return (
        <TouchableHighlight onPress={() => this.setState({ showRepeat: false })} underlayColor='white' style={Styles.pickerOverlay}>
          <View style={Styles.pickerContainer}>
            <TouchableHighlight onPress={() => this.setRepeat('0')} style={Styles.pickerTouch} underlayColor='white'>
              <Text style={Styles.pickerText}>One time</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.setRepeat('1')} style={Styles.pickerTouch} underlayColor='white'>
              <Text style={Styles.pickerText}>Every day</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.setRepeat('7')} style={Styles.pickerTouch} underlayColor='white'>
              <Text style={Styles.pickerText}>Every week</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.setRepeat('14')} style={Styles.pickerTouch} underlayColor='white'>
              <Text style={Styles.pickerText}>Every two weeks</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.setRepeat('30')} style={[Styles.pickerTouch, { borderBottomWidth: 0 }]} underlayColor='white'>
              <Text style={Styles.pickerText}>Every month</Text>
            </TouchableHighlight>
          </View>
        </TouchableHighlight>
      )
    }
  }

  submit() {
    if (this.state.selectedRoom == null) {
      alert('Please select room')
    } else {
      let realStart = this.state.startDate
      let realEnd = this.state.endTime
      if (this.state.allDay) {
        realStart.setHours(8)
        realStart.setMinutes(0)
        realEnd.setHours(17)
        realEnd.setMinutes(0)
      }
      let overlapping = false
      this.state.reservations.forEach(function(reservation) {
        if (component.state.edit == null || (component.state.edit != null && reservation.id != component.state.edit.id)) {
          if (reservation.repeat == '0') {
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= reservation.endTime &&
              reservation.startDate <= realEnd.getTime()
            ) {
              overlapping = true
            }
          } else if (reservation.repeat == '1') {
            let newStart = new Date(reservation.startDate)
            newStart.setFullYear(realStart.getFullYear())
            newStart.setMonth(realStart.getMonth())
            newStart.setDate(realStart.getDate())
            let newEnd = new Date(reservation.endTime)
            newEnd.setFullYear(realStart.getFullYear())
            newEnd.setMonth(realStart.getMonth())
            newEnd.setDate(realStart.getDate())
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= newEnd.getTime() &&
              newStart.getTime() <= realEnd.getTime()
            ) {
              overlapping = true
            }
          } else if (reservation.repeat == '7') {
            let newDate = new Date(reservation.startDate)
            let evening = new Date()
            evening.setHours(23)
            while (newDate < evening) {
              newDate.setDate(newDate.getDate() + 7)
            }
            let newEndDate = DateUtils.setFullDate(new Date(reservation.endTime), newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= newEndDate.getTime() &&
              newDate.getTime() <= realEnd.getTime()
            ) {
              overlapping = true
            }
          } else if (reservation.repeat == '14') {
            let newDate = new Date(reservation.startDate)
            let evening = new Date()
            evening.setHours(23)
            while (newDate < evening) {
              newDate.setDate(newDate.getDate() + 14)
            }
            let newEndDate = DateUtils.setFullDate(new Date(reservation.endTime), newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= newEndDate.getTime() &&
              newDate.getTime() <= realEnd.getTime()
            ) {
              overlapping = true
            }
          } else if (reservation.repeat == '30') {
            let newStart = new Date(reservation.startDate)
            newStart.setFullYear(realStart.getFullYear())
            newStart.setMonth(realStart.getMonth())
            let newEnd = new Date(reservation.endTime)
            newEnd.setFullYear(realStart.getFullYear())
            newEnd.setMonth(realStart.getMonth())
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= newEnd.getTime() &&
              newStart.getTime() <= realEnd.getTime()
            ) {
              overlapping = true
            }
          } else {
            if (
              component.state.selectedRoom.id == reservation.roomId &&
              realStart.getTime() <= reservation.endTime &&
              reservation.startDate <= realEnd.getTime()
            ) {
              overlapping = true
            }
          }
        }
      })

      if (overlapping) {
        alert('Date and time of this meeting are overlapping with some other meeting')
      } else {
        let startDate = realStart
        let endTime = realEnd
        endTime.setFullYear(this.state.startDate.getFullYear())
        endTime.setMonth(this.state.startDate.getMonth(), this.state.startDate.getDate())

        if (component.state.edit) {
          firebaseApp.database().ref('reservations/' + component.state.edit.id).set({
            roomId: component.state.selectedRoom.id,
            startDate: startDate.getTime(),
            endTime: endTime.getTime(),
            user: Utils.getUser().email,
            repeat: this.state.repeat,
            isRepeat: this.state.repeat != '0',
            skip: []
          })
        } else {
          firebaseApp.database().ref('reservations/' + (new Date()).getTime()).set({
            roomId: this.state.selectedRoom.id,
            startDate: startDate.getTime(),
            endTime: endTime.getTime(),
            user: Utils.getUser().email,
            repeat: this.state.repeat,
            isRepeat: this.state.repeat != '0',
            skip: []
          })
        }

        alert('Event has been created successfully.')

        this.props.navigator.pop()
      }
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{ flex: 1 }}>
          <View>
            <View style={[Styles.headerContainer, { flexDirection: 'row' }]}>
              {ViewUtils.renderBack(this.props.navigator, Utils.ellipsize(this.props.back))}
              <Text style={Styles.title}>{this.state.title}</Text>
            </View>
            <View style={[styles.optionGroup, {marginBottom: 20}]}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: Colors.accent, margin: 10, padding: 5}}>
                <Text style={{ fontSize: 20, color: Colors.primary, paddingLeft: 5 }}>Select room</Text>
              </View>
              <ListView
                style={{ backgroundColor: 'white' }}
                horizontal={true}
                dataSource={ds.cloneWithRows(RoomsUtils.getRooms())}
                renderRow={(room) =>
                  <TouchableHighlight style={{ margin: 5 }} onPress={() => this.setState({ selectedRoom: room })} underlayColor='white'>
                    <View>
                      <Image source={room.image} style={{ width: 150, height: 100 }} />
                      <Text style={{ textAlign: 'center'}}>{room.name}</Text>
                      {this._renderChecked(room)}
                    </View>
                  </TouchableHighlight>
                }
              />
            </View>

            <View style={styles.optionGroup}>
              {this._renderStartDateTile()}
              {this._renderStartDatePicker()}

              {this._renderStartTimeTile()}

              {this._renderEndTimeTile()}
              {this._renderEndTimePicker()}

              {this._renderRepeatTile()}
              {this._renderRepeat()}
              <TouchableHighlight underlayColor='white'>
                <View style={[styles.option, { borderTopWidth: 1, borderTopColor: Colors.accent, alignItems: 'center' }]}>
                  <Text>All day</Text>
                  <View style={{ flex: 1 }} />
                  <Switch value={this.state.allDay} onValueChange={() => this.setState({allDay: !this.state.allDay})} />
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        <TouchableHighlight onPress={() => this.submit()} underlayColor='white'>
          <Text style={Styles.bottomButton}>Submit</Text>
        </TouchableHighlight>
        {this._renderRepeatAndroid()}
      </View>
    )
  }
}

const styles = new StyleSheet.create({
  optionGroup: {
  },
  option: {
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    padding: 10
  }
})

BackAndroid.addEventListener('hardwareBackPress', () => {
  if (component && component.state.showRepeat) {
    component.setState({ showRepeat: false })
    return true
  } else if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop()
    return true
  }
  return false
})
