import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner, View, Button, Text, CardItem, Card, Body, Item, Label, Input, H3, Icon } from 'native-base'

import { ToastTr } from '../../components/Toast'
import CardInfo from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { styles as main, screenHeight } from '../../Style'


class Cards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected1: undefined,
      selected2: undefined,
      paymentsARR: [],
      refreshing: false,
      visibleModal: false,
    }

    this._refreshData = this._refreshData.bind(this)
    this._deleteItems = this._deleteItems.bind(this)
    this._editItem = this._editItem.bind(this)
    this._addTarget = this._addTarget.bind(this)
    this._addMyDebt = this._addMyDebt.bind(this)
    this._addOweme = this._addOweme.bind(this)
    this._increaseItem = this._increaseItem.bind(this)
    this._hideModal = this._hideModal.bind(this)
  }

  componentDidMount(){
    this.props.navigation.setParams({ refreshData: this._refreshData })
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targetDebts.Error.length > 0) {
      ToastTr.Danger(nextProps.targetDebts.Error)
    }
  }

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  _deleteItems(itemId){
    this.props.deletecard(itemId)
    ToastTr.Success('Удалено')
  }

  _addTarget() {
    this.props.navigation.navigate('AddEditItem', {type: 1})
  }

  _addMyDebt() {
    this.props.navigation.navigate('AddEditItem', {type: 2})
  }

  _addOweme() {
    this.props.navigation.navigate('AddEditItem', {type: 3})
  }

  _editItem(itemId){
    this.props.navigation.navigate('AddEditItem', {type: 0, itemid: itemId})
  }

  _hideModal() {
    this.setState({
      visibleModal: false
    })
  }

  _increaseItem(data){
    this.setState({
      visibleModal: true
    })
  }

  render() {
    const { targetDebts, user } = this.props

    if (targetDebts.isLoad) {
      return <Spinner />
    }

    var target = []
    var oweme = []
    var mydebt = []

    targetDebts.Targets.map(item => {
      if (item.Type == 1) {
        target.push(item)
      } else if (item.Type == 2) {
        oweme.push(item)
      } else if (item.Type == 3) {
        mydebt.push(item)
      }
    })

    return (
        <Container>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._refreshData}
              />
            }
          >
            <CardInfo itemtype={1} currency={user.DefCurrency} data={target} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addTarget} increaseItem={this._increaseItem} />
            <CardInfo itemtype={2} currency={user.DefCurrency} data={oweme} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addMyDebt} increaseItem={this._increaseItem} />
            <CardInfo itemtype={3} currency={user.DefCurrency} data={mydebt} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addOweme} increaseItem={this._increaseItem} />
          </Content>


          <Modal animationType="slide"
            transparent={true}
            visible={this.state.visibleModal}
            onRequestClose={this._hideModal}
          >
            <View style={main.modalOverlay} />
              <Card transparent style={styles.modalCalendar}>
                <CardItem header bordered>
                  <Text>Пополнение</Text>
                  <Icon button name="close" onPress={this._hideModal} style={[{marginRight:0, marginLeft:'auto'}, main.clGrey]}/>
                </CardItem>
                <CardItem>
                  <Body style={[main.fD_R, main.aI_C]}>
                    <Item floatingLabel style={{width:'90%'}} >
                      <Label>Сумма</Label>
                      <Input style={main.clGrey} keyboardType="number-pad"/>
                    </Item>
                    <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                  <Button block success onPress={this._hideModal}>
                    <Text>Пополнить</Text>
                  </Button>
                  </Body>
                </CardItem>
              </Card>
          </Modal>
        </Container>
    )
  }
}

const styles = StyleSheet.create({
  modalCalendar: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: screenHeight / 1.8,
    marginBottom: 45
  },
})



const mapStateToProps = state => {
  return {
    targetDebts: state.TargetDebts,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deletecard:(Id) => {
      dispatch(TargetActions.Delete(Id))
    },
    getTargetDebtList:(UserId)=> {
      dispatch(TargetActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)