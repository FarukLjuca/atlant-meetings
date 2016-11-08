import { NativeModules } from 'react-native'

var locale
try {
  locale = NativeModules.SettingsManager.settings.AppleLocale
} catch(err) {
  console.log(err)
}

if (locale == 'bs_US') {
  module.exports = {
    dontHaveAnAccount: 'Nemate račun?'
  }
} else {
  module.exports = {
    dontHaveAnAccount: "Don't have an account?"
  }
}
