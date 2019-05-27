import React, {Component} from 'react'
import { Text, Icon, Card, Button, ListItem, List, Right, Left } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Svg } from 'expo'

import { styles as main, IDebtColor, TargetColor, DebtColor, screenWidth } from '../Style'
import { capitalize } from '../utils/utils'
import { TARGET, IDEBT, OWEME } from '../constants/TargetDebts'

export default class CardInfo extends Component {
  constructor(props) {
    super(props)

    this._addNewItem = this._addNewItem.bind(this)
    this._description = this._description.bind(this)
    this._cardstyle = this._cardstyle.bind(this)
    this._showModal = this._showModal.bind(this)
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

  _cardstyle() {
    switch(this.props.itemtype) {
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

  _addNewItem() {
    this.props.addItem()
  }

  _editItem(id) {
    this.props.editItem(id)
  }

  _showModal(item) {
    this.props.showModalMenu(item)
  }

  render() {
    const { data, currency } = this.props
    const { Color } = this._cardstyle()

    return (
      <Grid style={[main.mt_10, (data.length === 0) && {marginBottom:10}]}>
        <Row>
          <Left style={main.ml_15}>
            <Text style={{color: Color}} >{this._description()}</Text>
          </Left>
          <Right>
            <Button small rounded onPress={this._addNewItem} style={[main.mr_15, main.ml_auto, {backgroundColor: Color}]}>
              <Icon name="add" fontSize={20}/>
            </Button>
          </Right>
        </Row>
        
        {(data.length > 0) &&
        <Card>
          <List
            dataArray={data}
            renderRow={item => {
              let progressCnt = (Number(item.CurAmount) * 100) / Number(item.Amount).toFixed(1)
              
              return (
              <ListItem key={item.Id}
                button 
                onPress={_=> this._editItem(item.Id)} 
                onLongPress={_ => this._showModal(item)}
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
          >
          </List>
        </Card>
        }
      </Grid>
    )
  }
}