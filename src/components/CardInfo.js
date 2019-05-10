import React, {Component} from 'react'
import { StyleSheet, Alert, ProgressBarAndroid, ListView, Platform, ProgressViewIOS, Modal } from 'react-native'
import { Text, Icon, Card, CardItem, Body, Button, ListItem, List, Right, Left, View } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

import { styles as main } from '../Style'
import { SummMask, capitalize } from '../utils/utils'
import { TARGET, IDEBT, OWEME } from '../constants/TargetDebts'


export default class CardInfo extends Component {
  constructor(props) {
    super(props)

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this._addNewItem = this._addNewItem.bind(this)
    this._description = this._description.bind(this)
    this._cardColor = this._cardColor.bind(this)
    this._cardstyle = this._cardstyle.bind(this)
  }

  _description() {
    switch(this.props.itemtype) {
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

  _cardColor() {
    switch(this.props.itemtype) {
      case TARGET:
        return TargetColor
      case IDEBT:
        return IDebtColor
      case OWEME:
        return DebtColor
    }
  }

  _cardstyle() {
    switch(this.props.itemtype) {
      case TARGET:
        return styles.cardTarget
      case IDEBT:
        return styles.cardIDebt
      case OWEME:
        return styles.cardDebt
    }
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
    const { data, currency } = this.props

    return (
      <Card>
        <CardItem header bordered style={[this._cardstyle(), styles.cardMain]}>
          <Text style={main.clWhite}>{this._description()}</Text>
          <Icon button name="add" style={[main.clWhite, main.mr_0, main.ml_auto]} onPress={this._addNewItem}/>
        </CardItem>
        <List
          dataSource={this.ds.cloneWithRows(data)}
          leftOpenValue={75} 
          rightOpenValue={-75}
          renderRightHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full danger onPress={_=> this._deleteItem(data, secId, rowId, rowMap) }>
              <Icon active name="trash" />
            </Button>
          }
          renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full success onPress={_=> this._increaseItem(data)} >
              <Icon name="add"/>
            </Button>
          }
          renderRow={item => {
            let progressCnt = Number((((item.CurAmount * 100) / item.Amount) / 100).toFixed(1))

            return (
            <ListItem key={item.Id} button onPress={_=> this._editItem(item.Id)} >
              <Grid>
                <Row>
                  <Col>
                    <Text style={main.clGrey}>{capitalize(item.GoalName)}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col style={main.ml_15}>
                  {(Platform.OS === 'ios') && <ProgressViewIOS progressViewStyle="bar" trackTintColor={this._cardColor()} progress={progressCnt} />}
                  {(Platform.OS === 'android') && <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} color={this._cardColor()} progress={progressCnt} />}
                  </Col>
                </Row>
                <Row>
                  <Left style={main.ml_15}>
                    <Text style={{color:this._cardColor()}}>{SummMask(item.CurAmount)} {currency}</Text>
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
  deleteButton: {
    ...main.clWhite,
    marginTop:1, 
    marginBottom:'auto'
  }
})
