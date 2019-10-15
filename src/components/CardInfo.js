import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Text, Card, ListItem, View } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'

import { styles as main } from '../Style'
import { capitalize, SummMask } from '../utils/utils'
import { TARGET, IDEBT, OWEME } from '../constants/TargetDebts'

const defineDesc = (itemtype) => {
  switch(itemtype) {
    case TARGET:
      return 'Цели'
    case IDEBT:
      return 'Я должен'
    case OWEME:
      return 'Мне должны'
    default:
      return 'ERROR'
  }
}

const defineCardStyle = (itemtype) => {
  switch(itemtype) {
    case TARGET:
      return {
        fillFull: '#4c799c',
        prcColor:'#5383a9'
      }
    case IDEBT:
      return {
        fillFull: '#c35353',
        prcColor:'#de5b5b'
      }
    case OWEME:
      return {
        fillFull: '#498c84',
        prcColor:'#4e968e'
      }
  }
}

const defineCardIcon = (item) => {
  let needFire = 0

  if ((item.CompleteDate == null) || (item.CompleteDate.length === 0)) {
    return null
  }
  if (item.IsActive===false) {
    return null
  }

  needFire = moment(item.CompleteDate).diff(moment())
  needFire = Math.trunc(moment.duration(needFire).asHours())

  if(needFire<0) {
    return (
      <FontAwesome name='fire' size={20} style={{marginRight:5, color:'orange'}} />
    )
  }

  if ((needFire<24*7)&&(needFire>0)) {
    return (
      <FontAwesome name='exclamation-circle' size={20} style={{marginRight:5, color:'white'}} />
    )
  }
  return null
}


export const CardInfo = (props) => {
    const { data, currency, itemtype, editItem, showModalMenu, showArchive } = props
    const { fillFull, prcColor } = defineCardStyle(itemtype)
    const Desc = defineDesc(itemtype)

    if (data.length === 0 ) {
      return <></>
    }

    if (!showArchive) {
      var arr = data.filter(item=> item.IsActive === true)
      if (arr.length === 0 ) {
        return <></>
      }
    }


    return (
      <>
      <Text style={styles.descStyle} note>{Desc}</Text>
      <Card transparent>
        <FlatList
          data={data}
          keyExtractor = {(item, index) => 'key-'+item.GoalName + index}
          renderItem={({item}) => {

            let progressCnt = (Number(item.CurAmount) * 100) / Number(item.Amount).toFixed(1)
            return (
              <ListItem noBorder button
                style={((!showArchive)&&(!item.IsActive))?{display:'none'}:{}}
                onPress={_=> editItem(item.Id)} 
                onLongPress={_=> showModalMenu(item)}
              >
                <Row style={[{backgroundColor: fillFull, borderRadius:4}, (!item.IsActive)?{opacity:0.6}:{}]}>
                  <Row style={{backgroundColor: prcColor, borderRadius:4, width:`${progressCnt}%`, height:56}}></Row>
                  <Grid style={styles.mainGrid}>
                    <Row style={[main.pdL_25, main.pdR_25, main.fD_R, main.fl_1]}>
                      <View style={[main.fD_R, main.fl_1, main.jC_C, {marginTop:1}]}>
                        {defineCardIcon(item)}
                        <Text style={[main.clWhite]} numberOfLines={1}>{capitalize(item.GoalName)}</Text>
                      </View>
                    </Row>
                    <Row style={[main.pdL_10, main.pdR_10]}>
                      <Text style={styles.summStyle}>{SummMask(item.CurAmount)} {currency} из {SummMask(item.Amount)} {currency}</Text>
                    </Row>
                  </Grid>
                </Row>
              </ListItem>
            )
          }}
        />
      </Card>
      </>
    ) 
  }

  const styles = StyleSheet.create({
    mainGrid: {
      position:'absolute',
      top:0,
      left:0,
      width:'100%',
      height:'100%',
      ...main.fl_1,
      ...main.fD_C,
      ...main.jC_C,
      paddingVertical:3
    },
    summStyle: {
      ...main.clWhite,
      ...main.ml_auto,
      ...main.mr_0
    },
    descStyle: {
      ...main.mt_10, 
      ...main.ml_10,
      ...main.clIvan,
      marginBottom:6
    }
  })