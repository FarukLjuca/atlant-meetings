import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  Platform,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

const Colors = require('../values/colors.js')
const Styles = require('../values/styles.js')
const Strings = require('../values/strings.js')
const ViewUtils = require('../values/utils.view.js')
const firebaseApp = require('../values/firebase.js')

const SCREEN_WIDTH = require('Dimensions').get('window').width
const HEADER_WIDTH = 2560
const HEADER_HEIGHT = 1440

let component

export default class RegisterScene extends Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
      repeatPassword: ''
    }

    component = this
  }

  login() {
    this.props.navigator.push({
      name: 'Login',
      back: 'Regiser'
    })
  }

  register() {
    if (this.state.email.substr(this.state.email.indexOf('@') + 1, 12) != 'atlantbh.com') {
      alert('You need to enter Atlantbh email.')
    } else if (this.state.password != this.state.repeatPassword) {
      alert('Password and repeat password are not same')
    } else {
      firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function() {
        component.props.navigator.push({
          name: 'Init'
        })
      }, function(error) {
        alert(error.message)
      })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={[Styles.headerContainer, { flexDirection: 'row' }]}>
            {ViewUtils.renderBack(this.props.navigator, this.props.back)}
            <Text style={Styles.title}>{this.props.title}</Text>
          </View>
          <Image
            source={require('../img/home-4.jpg')}
            style={{ width: SCREEN_WIDTH, height: (SCREEN_WIDTH / HEADER_WIDTH) * HEADER_HEIGHT }}
          />
          <View style={{ marginLeft: 30, marginRight: 30, marginTop: 50, flex: 1 }}>
            <Text>Email:</Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='1'
                onChangeText={(text) => this.setState({email: text})}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                placeholder='Enter email'
                style={styles.textInputStandard}
                onSubmitEditing={() => this.focusNextField('2')}
              />
            </View>

            <Text style={{ marginTop: 20 }}>Password:</Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='2'
                onChangeText={(text) => this.setState({password: text})}
                placeholder='Enter password'
                secureTextEntry={true}
                style={styles.textInputStandard}
                onSubmitEditing={() => this.focusNextField('3')}
              />
            </View>

            <Text style={{ marginTop: 20 }}>Repeat password:</Text>
            <View style={styles.textInputWrapper}>
              <TextInput
                ref='3'
                onChangeText={(text) => this.setState({repeatPassword: text})}
                placeholder='Repeat password'
                secureTextEntry={true}
                style={styles.textInputStandard}
                onSubmitEditing={() => this.register()}
              />
            </View>

            <View style={{ marginTop: 40, marginBottom: 40, flexDirection: 'row', justifyContent: 'center' }}>
              <Text>Already have an account</Text>
              <TouchableHighlight onPress={() => this.login()} underlayColor='white'>
                <Text style={{ color: Colors.accent, marginLeft: 5 }}>Login</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        <TouchableHighlight onPress={() => this.register()} underlayColor='white'>
          <Text style={styles.bottomButton}>Register</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: Colors.primary,
    color: 'white',
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center'
  },
  textInputStandard: {
    height: 40
  },
  textInputWrapper: {
    borderBottomWidth: (Platform.OS == 'ios') ? 1 : 0,
    borderBottomColor: Colors.primary
  }
})
