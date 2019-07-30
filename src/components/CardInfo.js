import React from 'react'
import { FlatList } from 'react-native'
import { Text, Card, ListItem } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

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
    const { data, currency, itemtype, editItem, showModalMenu } = props
    const { mainColor, fillFull, prcColor } = defineCardStyle(itemtype)
    const Desc = defineDesc(itemtype)

    if (data.length === 0 ) {
      return <></>
    }

    return (
      <>
      <Text style={[main.fontFam, main.mt_10, main.ml_10, main.clIvan, {marginBottom:6}]} note>{Desc}</Text>
      <Card style={{backgroundColor: mainColor}}>
        <FlatList
          data={data}
          keyExtractor = {(item, index) => 'key-'+item.GoalName + index}
          renderItem={({item}) => {

            let progressCnt = (Number(item.CurAmount) * 100) / Number(item.Amount).toFixed(1)
            
            return (
            <ListItem key={'target-'+item.Id + item.GoalName}
              button 
              onPress={_=> editItem(item.Id)} 
              onLongPress={_=> showModalMenu(item)}
            >
              <Row style={{backgroundColor: fillFull, borderRadius:4}}>
                <Row style={{backgroundColor: prcColor, borderRadius:4, width:`${progressCnt}%`, height:50}}></Row>
                <Grid style={[{position:'absolute', top:0, left:0, width:'100%', height:'100%'}, main.fl_1, main.fD_C, main.jC_C]}>
                  <Row style={[main.pdL_10, main.pdR_10]}>
                    <Text style={[main.clWhite, main.mr_auto, main.ml_auto, main.fontFam]}>{capitalize(item.GoalName)}</Text>
                  </Row>
                  <Row style={[main.pdL_10, main.pdR_10]}>
                    <Text style={[main.clWhite, main.ml_auto, main.mr_0, main.fontFam]}>{SummMask(item.CurAmount)} {currency} из {SummMask(item.Amount)} {currency}</Text>
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