let user
let userProfile

module.exports = {
  ellipsize(text) {
    if (text.length > 6) {
      text = text.substr(0, 6)
      text += '\u2026'
    }
    return text
  },
  getUser() {
    return user
  },
  setUser(_user) {
    user = _user
  },
  getProfile() {
    return userProfile
  },
  setProfile(profile) {
    userProfile = profile
  }
}
