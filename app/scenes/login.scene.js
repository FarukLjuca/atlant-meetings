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

export default class LoginScene extends Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: ''
    }
  }

  componentDidMount() {
    component = this
  }

  register() {
    this.props.navigator.push({
      name: 'Register',
      back: 'Login'
    })
  }

  resetPassword() {
    this.props.navigator.push({
      name: 'ResetPassword',
      back: 'Login'
    })
  }

  login() {
    firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function() {
      component.props.navigator.push({
        name: 'Init'
      })
    }, function(error) {
      alert(error.message)
    })
  }

  focusNextField (nextField) {
    this.refs[nextField].focus()
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps={true}
        >
          <View style={[Styles.headerContainer, { flexDirection: 'row' }]}>
            {ViewUtils.renderBack(this.props.navigator, this.props.back)}
            <Text style={Styles.title}>{this.props.title}</Text>
          </View>
          <Image
            source={require('../img/expertise-3.jpg')}
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
                returnKeyType='next'
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
                returnKeyType='done'
                style={styles.textInputStandard}
                onSubmitEditing={() => this.login()}
              />
            </View>
            <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'center' }}>
              <Text>{Strings.dontHaveAnAccount}</Text>
              <TouchableHighlight onPress={() => this.register()} underlayColor='white'>
                <Text style={{ color: Colors.accent, marginLeft: 5 }}>Register</Text>
              </TouchableHighlight>
            </View>
            <View style={{ marginTop: 10, marginBottom: 40, flexDirection: 'row', justifyContent: 'center' }}>
              <Text>Forgot password?</Text>
              <TouchableHighlight onPress={() => this.resetPassword()} underlayColor='white'>
                <Text style={{ color: Colors.accent, marginLeft: 5 }}>Reset password</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
        <TouchableHighlight onPress={() => this.login()} underlayColor='white'>
          <Text style={styles.bottomButton}>Login</Text>
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
