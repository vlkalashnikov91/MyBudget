import React from 'react'
import { FlatList } from 'react-native'
import { Text, Icon, Card, Button, ListItem, Right, Left } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Svg } from 'expo'

import { styles as main, IDebtColor, TargetColor, DebtColor, screenWidth } from '../Style'
import { capitalize } from '../utils/utils'
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
        Color: TargetColor
      }
    case IDEBT:
      return {
        Color: IDebtColor
      }
    case OWEME:
      return {
        Color: DebtColor
      }
  }
}


export const CardInfo = (props) => {
    const { data, currency, itemtype, addItem, editItem, showModalMenu } = props
    const { Color } = defineCardStyle(itemtype)
    const Desc = defineDesc(itemtype)

    return (
      <Grid style={[main.mt_10, (data.length === 0) && {marginBottom:10}]}>
        <Row>
          <Left style={main.ml_15}>
            <Text style={{color: Color}}>{Desc}</Text>
          </Left>
          <Right>
            <Button small rounded onPress={addItem} style={[main.mr_15, main.ml_auto, {backgroundColor: Color}]}>
              <Icon name="add" fontSize={20}/>
            </Button>
          </Right>
        </Row>
        
        {(data.length > 0) &&
        <Card>
          <FlatList
            data={data}
            keyExtractor = {(item, index) => 'key-'+item.GoalName + index}
            renderItem={({item}) => {

              let progressCnt = (Number(item.CurAmount) * 100) / Number(item.Amount).toFixed(1)
              
              return (
              <ListItem key={'target-'+item.Id + item.GoalName}
                button 
                onPress={_=> editItem(item.Id)} 
                onLongPress={_ => showModalMenu(item)}
              >
                <Grid>
                  <Row>
                    <Col>
                      <Text style={main.clGrey}>{capitalize(item.GoalName)}</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Svg width={screenWidth/1.12} height="26">
                      <Svg.Rect x="0" y="0" width="100%" height="26" fill='#d9d9d9' />
                      <Svg.Rect x="0" y="0" width={`${progressCnt}%`} height="26" fill={Color} />
                      <Text style={main.clWhite}>{item.CurAmount} из {item.Amount} {currency}</Text>
                    </Svg>
                  </Row>
                </Grid>
              </ListItem>
              )
            }}
          />
        </Card>
        }
      </Grid>
    )
  }