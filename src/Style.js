import { StyleSheet, Dimensions } from 'react-native'

export const screenWidth =  Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height

export const ivanColor = '#395971'

export const styles = StyleSheet.create({
  bgIvan: {
    backgroundColor: ivanColor,
  },
  bgWhite: {
    backgroundColor: 'white',
  },
  bgGreen: {
    backgroundColor: '#34A34F'
  },
  clIvan: {
    color: ivanColor
  },
  clWhite: {
    color:'white'
  },
  clGrey: {
    color: '#384850'
  },
  clBlack: {
    color: 'black'
  },
  exitButton: {
    marginTop: 20
  },
  rowStyle: {
    justifyContent: 'center', 
    flexDirection: 'row',
  },
  rowStyleCenter: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  modalLoad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    marginHorizontal: screenWidth / 3 - 15 ,
    marginTop: screenHeight / 3 + 35,
    marginBottom: screenHeight / 3 + 35
  },
  modalCalendar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff",
    borderRadius: 4,
    marginHorizontal: 15,
    marginTop: screenHeight / 4,
    marginBottom: screenHeight / 4 - 15
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})





