import React from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { Text, Card, ListItem, View } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'

import { styles as main, IDebtColor, TargetColor, DebtColor } from '../Style'
import { capitalize, SummMask } from '../utils/utils'
import { TARGET, IDEBT, OWEME } from '../constants/TargetDebts'

function defineDesc (itemtype) {
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

function defineCardStyle (itemtype) {
  switch(itemtype) {
    case TARGET:
      return {
        mainColor: TargetColor,
        fillFull: '#4c799c',
        prcColor:'#5383a9'
      }
    case IDEBT:
      return {
        mainColor: IDebtColor,
        fillFull: '#c35353',
        prcColor:'#de5b5b'
      }
    case OWEME:
      return {
        mainColor: DebtColor,
        fillFull: '#498c84',
        prcColor:'#4e968e'
      }
  }
}


export const CardInfo = (props) => {
    const { data, currency, itemtype, editItem, showModalMenu, showArchive } = props
    const { mainColor, fillFull, prcColor } = defineCardStyle(itemtype)
    const Desc = defineDesc(itemtype)
    const filterData = showArchive ? data : data.filter(item => item.IsActive === true)

    if (filterData.length === 0 ) {
      return <></>
    }

    return (
      <>
      <Text style={styles.descStyle} note>{Desc}</Text>
      <Card style={{backgroundColor: mainColor}}>
        <FlatList
          data={filterData}
          keyExtractor = {(item, index) => 'key-'+item.GoalName + index}
          renderItem={({item}) => {

            let progressCnt = (Number(item.CurAmount) * 100) / Number(item.Amount).toFixed(1)

            let needFire = -1
            if ((item.CompleteDate == null) || (item.CompleteDate.length === 0)) {
              needFire = -1
            } else {
              needFire = moment().diff(moment(item.CompleteDate.split('.')))
              needFire = Math.trunc(moment.duration(needFire).asHours())
            }

            return (
            <ListItem key={'target-'+item.Id + item.GoalName}
              button 
              onPress={_=> editItem(item.Id)} 
              onLongPress={_=> showModalMenu(item)}
            >
              <Row style={{backgroundColor: fillFull, borderRadius:4}}>
                <Row style={{backgroundColor: prcColor, borderRadius:4, width:`${progressCnt}%`, height:50}}></Row>
                <Grid style={styles.mainGrid}>
                  <Row style={[main.pdL_10, main.pdR_10]}>
                    <View style={[main.mr_auto, main.ml_auto, main.fD_R]}>
                      <Text style={main.clWhite}>{capitalize(item.GoalName)}</Text>
                      {((needFire<24)&&(needFire>0))&&<FontAwesome name='fire' size={20} style={styles.fireIcon} />}
                      {(needFire<0)&&<FontAwesome name='hourglass-end' size={15} style={styles.hourIcon} />}
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
      ...main.jC_C
    },
    summStyle: {
      ...main.clWhite,
      ...main.ml_auto,
      ...main.mr_0
    },
    fireIcon: {
      ...main.ml_20, 
      color: 'orange'
    },
    hourIcon: {
      ...main.ml_20,
      marginTop:3,
      color: 'white'
    },
    descStyle: {
      ...main.mt_10, 
      ...main.ml_10,
      ...main.clIvan,
      marginBottom:6
    }
  })