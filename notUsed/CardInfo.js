import React, {Component} from 'react'
import { StyleSheet, Alert } from 'react-native'
import { Text, Icon, Card, CardItem, H3 } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'

export default class CardInfo extends Component {
  constructor(props) {
    super(props)

    this._addNewItem = this._addNewItem.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    if (JSON.stringify(nextProps.value) == JSON.stringify(this.props.value)) {
      return false
    }
    return true
  }

  _deleteItem(item){
    Alert.alert(
      'Вы уверены?',
      null,
      [
        {text: 'Нет'},
        {text: 'Да', onPress: () => {
            this.props.dropItem(item)
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

  render() {
    const { itemtype, value, currency } = this.props

    let cardItemStyle, gridStyle, desc
    
    if (itemtype == 1) {
      cardItemStyle = styles.cardTarget
      gridStyle = styles.gridTarget
      desc = 'Цели'

    } else if (itemtype == 2) {
      cardItemStyle = styles.cardIDebt
      gridStyle = styles.gridIDebt
      desc = 'Я должен'

    } else if (itemtype == 3) {
      cardItemStyle = styles.cardDebt
      gridStyle = styles.gridDebt
      desc = 'Мне должны'
    }

    return (
      <Card>
        <CardItem header bordered style={[cardItemStyle, styles.cardMain]}>
          <Text style={{color:'white'}}>{desc}</Text>
          <Icon button name="ios-add" style={styles.addButton} onPress={this._addNewItem}/>
        </CardItem>
        {
          value.map((el, index) => {
            return (
                <CardItem style={cardItemStyle} key={index}>
                  <Grid style={gridStyle}>
                    <Row style={{marginBottom:6}} button onPress={() => this._editItem(el.Id)} >
                      <H3 style={{color:'white', marginLeft:'auto', marginRight:'auto'}}>{el.GoalName}</H3>
                      <FontAwesome button name='trash' size={18} style={styles.deleteButton} onPress={() => this._deleteItem(el.Id) }/>
                    </Row>
                    <Row button onPress={() => this._editItem(el.Id)} >
                      <Col size={2}>
                        <Icon android='md-cash' ios='ios-cash' style={{color:'white'}}/>
                      </Col>
                      <Col size={3}>
                        <Text style={{color:'white', marginLeft:5, textAlign:'right'}}>{`${el.CurAmount} из ${el.Amount} ${currency}`}</Text>
                      </Col>
                    </Row>
                  </Grid>
                </CardItem>
              )
            })
          }
      </Card>
    )
  }
}

  
const styles = StyleSheet.create({
  cardMain:{
    display: 'flex', 
    borderBottomLeftRadius:0, 
    borderBottomRightRadius:0
  },
  cardTarget: {
    backgroundColor: '#5D90B7',
    borderColor: '#0A0F85',
    borderRadius: 0,
  },
  cardIDebt: {
    backgroundColor: '#ED665A',
    borderColor: '#7A0505',
    borderRadius: 0,
  },
  cardDebt: {
    backgroundColor: '#4FA69D',
    borderColor: '#025F0B',
    borderRadius: 0,
  },
  gridTarget: {
    borderColor:'#4C799C',
    backgroundColor:'#4C799C',
    borderRadius:10,
    paddingLeft:15,
    paddingRight:15,
    borderWidth:2,
  },
  gridDebt: {
    borderColor:'#498C84',
    backgroundColor:'#498C84',
    borderRadius:10,
    paddingLeft:15,
    paddingRight:15,
    borderWidth:2,
  },
  gridIDebt: {
    borderColor:'#C35353',
    backgroundColor:'#C35353',
    borderRadius:10,
    paddingLeft:15,
    paddingRight:15,
    borderWidth:2,
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
