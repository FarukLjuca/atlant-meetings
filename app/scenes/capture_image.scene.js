import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  Dimensions,
  CameraRoll,
  StyleSheet,
  TouchableHighlight
} from 'react-native'
import Camera from 'react-native-camera'

import Room from '../components/room.component.js'

const Styles = require('../values/styles.js')
const Utils = require('../values/utils.js')
const RoomUtils = require('../values/utils.rooms.js')
const ViewUtils = require('../values/utils.view.js')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const firebaseApp = require('../values/firebase.js')

let component, camera

export default class CaptureImage extends Component {

  constructor() {
    super()
  }

  componentDidMount() {
    component = this
  }

  componentWillUnmount() {
    camera = null
  }

  changeProfileImage() {
    //firebaseApp.storage().child('images/' + Utils.getUser().id).put(file)
  }

  takePicture() {
    camera.capture()
      .then((data) => {
        Utils.setProfile(data)
        component.props.navigator.pop()
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={[Styles.headerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          {ViewUtils.renderBack(this.props.navigator, this.props.back)}
          <Text style={[Styles.title, { marginLeft: 125 }]}>{this.props.title}</Text>
        </View>

        <Camera
          ref={(cam) => { camera = cam }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={() => this.takePicture()}>[CAPTURE]</Text>
        </Camera>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
    marginBottom: 80
  }
})
