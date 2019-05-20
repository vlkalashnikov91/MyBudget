import { StyleSheet, Dimensions } from 'react-native'

export const screenWidth =  Dimensions.get('screen').width
export const screenHeight = Dimensions.get('screen').height
export const ivanColor = '#395971'
export const IDebtColor = '#ED665A'
export const TargetColor = '#5D90B7'
export const DebtColor = '#4FA69D'
export const ivanGreen = '#43ac6a'
export const ivanDanger = '#F04124'
export const ivanGray = '#a7a7a7'

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
    backgroundColor: ivanGreen
  },
  bgGray: {
    backgroundColor: ivanGray
  },
  bgDanger: {
    backgroundColor: ivanDanger
  },
  clIvan: {
    color: ivanColor
  },
  clIvanD: {
    color: ivanDanger
  },
  clIvanG: {
    color: ivanGreen
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
  mt_10: {
    marginTop:10
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
  pd_0: {
    padding:0
  },
  pdR_10: {
    paddingRight: 10
  },
  pdR_50: {
    paddingRight: 50
  },
  pdR_25: {
    paddingRight: 25
  },
  pdL_10: {
    paddingLeft: 10
  },
  pdL_25: {
    paddingLeft: 25
  },
  pdL_50: {
    paddingLeft: 50
  },



  width_90prc: {
    width:'90%'
  },
  txtAl_c: {
    textAlign:'center'
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
    marginHorizontal: 25,
    marginTop: screenHeight / 4,
    marginBottom: screenHeight / 4 - 10
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})





