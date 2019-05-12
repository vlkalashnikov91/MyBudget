import { StyleSheet, Dimensions } from 'react-native'

export const screenWidth =  Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height

export const ivanColor = '#395971'

export const styles = StyleSheet.create({
  fl_1: {
    flex: 1
  },
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
  jC_C: {
    justifyContent: 'center'
  },
  fD_R: {
    flexDirection: 'row'
  },
  fD_C: {
    flexDirection: 'column'
  },
  aI_C: {
    alignItems: 'center'
  },
  mt_20: {
    marginTop:20
  },
  ml_auto: {
    marginLeft:'auto'
  },
  ml_0: {
    marginLeft:0
  },
  ml_10: {
    marginLeft:10
  },
  ml_15: {
    marginLeft:15
  },
  ml_20: {
    marginLeft:20
  },
  mr_auto: {
    marginRight:'auto'
  },
  mr_0: {
    marginRight:0
  },
  mr_15: {
    marginRight:15
  },
  mr_20: {
    marginRight:20
  },
  width_90prc: {
    width:'90%'
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
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})





