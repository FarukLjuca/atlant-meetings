import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  ListView,
  CameraRoll,
  TouchableHighlight
} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'

import Room from '../components/room.component.js'

const Styles = require('../values/styles.js')
const Utils = require('../values/utils.js')
const RoomUtils = require('../values/utils.rooms.js')
const ViewUtils = require('../values/utils.view.js')

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const firebaseApp = require('../values/firebase.js')

const Blob = RNFetchBlob.polyfill.Blob
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

let component

export default class ChooseImage extends Component {

  constructor() {
    super()

    this.state = {
      photos: null
    }
  }

  componentDidMount() {
    component = this

    const fetchParams = {
        first: 25
    }
    CameraRoll.getPhotos(fetchParams)
      .then(function(data) {
        var arr = []

        for (var i = 0; i < data.edges.length; i++) {
          arr.push(data.edges[i].node)
        }

        component.setState({ photos: arr })
      }, function(err) {
        console.log('Error')
        console.log(err)
      })
  }

  changeProfileImage(photo) {
    console.log(photo)
    const file = {
      uri: photo.uri,
      name: photo.fileName,
      type: 'image/jpeg'
    }
    firebaseApp.storage().ref().child('images/' + Utils.getUser().email).put(file)
  }

  _renderListView() {
    console.log('ListView Data')
    console.log(this.state.photos)
    if (this.state.photos) {
      return (
        <ListView
          contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', margin: 5 }}
          dataSource={ds.cloneWithRows(this.state.photos)}
            renderRow={(photo) =>
              <TouchableHighlight onPress={() => this.changeProfileImage(photo.image)} underlayColor='white' style={{ width: 100, height: 100, margin: 5 }}>
                <Image source={{ uri: photo.image.uri }} style={{ width: 80, height: 80 }} resizeMode={'cover'} />
              </TouchableHighlight>
          }
        />
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={[Styles.headerContainer, { flexDirection: 'row', alignItems: 'center' }]}>
          {ViewUtils.renderBack(this.props.navigator, this.props.back)}
          <Text style={[Styles.title, { marginLeft: 125 }]}>{this.props.title}</Text>
        </View>
        {this._renderListView()}
      </View>
    )
  }
}
