import React, {Component} from 'react'
import { StyleSheet, Alert, ProgressBarAndroid, ListView, Platform, ProgressViewIOS, Modal } from 'react-native'
import { Text, Icon, Card, CardItem, Body, Button, ListItem, List, Right, Left, View } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'

import { styles as mainStyle } from '../Style'
import { SummMask, capitalize } from '../utils/utils'


export default class CardInfo extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this._addNewItem = this._addNewItem.bind(this)
  }

  _deleteItem(data, secId, rowId, rowMap){
    Alert.alert(
      `${capitalize(data.GoalName)}`,
      'Удалить цель?',
      [
        {text: 'Нет', onPress: ()=>{
          rowMap[`${secId}${rowId}`].props.closeRow()
        }},
        {text: 'Да', onPress: () => {
            rowMap[`${secId}${rowId}`].props.closeRow()
            this.props.dropItem(data.Id)
          }
        },
      ]
    )
  }

  _addNewItem() {
    this.props.addItem()
  }

  _editItem(id) {
    this.props.editItem(id)
  }

  _increaseItem(data){
      this.props.increaseItem(data)
  }



  render() {
    const { itemtype, data, currency } = this.props

    let cardItemStyle, desc, cardColor
    
    if (itemtype == 1) {
      cardItemStyle = styles.cardTarget
      cardColor = TargetColor
      desc = 'Цели'

    } else if (itemtype == 2) {
      cardItemStyle = styles.cardIDebt
      cardColor = IDebtColor
      desc = 'Я должен'

    } else if (itemtype == 3) {
      cardItemStyle = styles.cardDebt
      cardColor = DebtColor
      desc = 'Мне должны'
    }

    return (
      <Card>
        <CardItem header bordered style={[cardItemStyle, styles.cardMain]}>
          <Text style={mainStyle.clWhite}>{desc}</Text>
          <Icon button name="add" style={styles.addButton} onPress={this._addNewItem}/>
        </CardItem>
        <List
          dataSource={this.ds.cloneWithRows(data)}
          leftOpenValue={75} 
          rightOpenValue={-75}
          renderRightHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full danger onPress={() => this._deleteItem(data, secId, rowId, rowMap) }>
              <Icon active name="trash" />
            </Button>
          }
          renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full success onPress={()=> this._increaseItem(data)} >
              <Icon name="add"/>
            </Button>
          }
          renderRow={item => {
            let progressCnt = Number((((item.CurAmount * 100) / item.Amount) / 100).toFixed(1))

            return (
            <ListItem key={item.Id}
              button
              onPress={() => this._editItem(item.Id)}
            >
              <Grid>
                <Row>
                  <Col>
                    <Text style={mainStyle.clGrey}>{capitalize(item.GoalName)}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col style={{marginLeft:15}}>
                  {(Platform.OS === 'ios') && <ProgressViewIOS progressViewStyle="bar" trackTintColor={cardColor} progress={progressCnt} />}
                  {(Platform.OS === 'android') && <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} color={cardColor} progress={progressCnt} />}
                  </Col>
                </Row>
                <Row>
                  <Left style={{marginLeft:15}}>
                    <Text style={{color:cardColor}}>{SummMask(item.CurAmount)} {currency}</Text>
                  </Left>
                  <Right>
                    <Text note>{SummMask(item.Amount)} {currency}</Text>
                  </Right>
                </Row>
              </Grid>
            </ListItem>
            )
          }}
        >
        </List>
      </Card>
    )
  }
}

const IDebtColor = '#ED665A'
const TargetColor = '#5D90B7'
const DebtColor = '#4FA69D'
  
const styles = StyleSheet.create({
  cardMain:{
    display: 'flex', 
    borderBottomLeftRadius:0, 
    borderBottomRightRadius:0
  },
  cardTarget: {
    backgroundColor: TargetColor,
    borderColor: '#0A0F85',
    borderRadius: 0,
  },
  cardIDebt: {
    backgroundColor: IDebtColor,
    borderColor: '#7A0505',
    borderRadius: 0,
  },
  cardDebt: {
    backgroundColor: DebtColor,
    borderColor: '#025F0B',
    borderRadius: 0,
  },
  addButton: {
    color:'white', 
    marginRight:0, 
    marginLeft:'auto'
  },
  deleteButton: {
    color:'white',
    marginTop:1, 
    marginBottom:'auto'
  }
})
