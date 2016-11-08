import { StyleSheet } from 'react-native'

const Colors = require('./colors.js')

module.exports = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 90,
    marginRight: 90,
    fontSize: 18,
    textAlign: 'center',
    color: 'white'
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    backgroundColor: Colors.primary
  },
  back: {
    color: 'white',
    fontSize: 16,
    paddingRight: 10
  },
  backWrapper: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backTouch: {
    position: 'absolute',
    alignItems: 'center'
  },
  backChevron: {
    height: 25,
    width: 25,
    marginTop: 4,
    marginBottom: 4
  },
  bottomButton: {
    backgroundColor: '#009DAE',
    color: 'white',
    fontSize: 18,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center'
  },
  rightMenu: {
    backgroundColor: 'white',
    padding: 20,
    minWidth: 180,
    borderRadius: 5,
    elevation: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    },
    position: 'absolute',
    right: 5,
    top: 5
  },
  rightMenuOverlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0
  },
  rightMenuTouch: {
    padding: 2
  },
  rightMenuText: {
    fontSize: 16
  },
  pickerOverlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    paddingRight: 40,
    paddingLeft: 40,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'rgba(216, 216, 216, 0.8)'
  },
  pickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
    elevation: 10,
    shadowColor: 'gray',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  pickerTouch: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray'
  },
  pickerText: {
    fontSize: 16
  }
})
