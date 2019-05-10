import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner, View, Button, Text, CardItem, Card, Body, Item, Label, Input, H3, Icon } from 'native-base'

import { ToastTr } from '../../components/Toast'
import CardInfo from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { TARGET, IDEBT, OWEME, EDIT } from '../../constants/TargetDebts'
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
    if (nextProps.targets.Error.length > 0) {
      ToastTr.Danger(nextProps.targets.Error)
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
    this.props.navigation.navigate('AddEditItem', {type: TARGET})
  }

  _addMyDebt() {
    this.props.navigation.navigate('AddEditItem', {type: IDEBT})
  }

  _addOweme() {
    this.props.navigation.navigate('AddEditItem', {type: OWEME})
  }

  _editItem(itemId){
    this.props.navigation.navigate('AddEditItem', {type: EDIT, itemid: itemId})
  }

  _hideModal() {
    this.setState({ visibleModal: false })
  }

  _increaseItem(data){
    this.setState({ visibleModal: true })
  }

  render() {
    const { targets, user } = this.props

    if (targets.isLoad) {
      return <Spinner />
    }

    var target = targets.Targets.filter(item => item.Type === TARGET)
    var mydebt = targets.Targets.filter(item => item.Type === IDEBT)
    var oweme = targets.Targets.filter(item => item.Type === OWEME)

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
            <CardInfo itemtype={TARGET} currency={user.DefCurrency} data={target} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addTarget} increaseItem={this._increaseItem} />
            <CardInfo itemtype={IDEBT} currency={user.DefCurrency} data={mydebt} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addMyDebt} increaseItem={this._increaseItem} />
            <CardInfo itemtype={OWEME} currency={user.DefCurrency} data={oweme} dropItem={this._deleteItems} editItem={this._editItem} addItem={this._addOweme} increaseItem={this._increaseItem} />
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
                  <Icon button name="close" onPress={this._hideModal} style={[main.mr_0, main.ml_auto, main.clGrey]}/>
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
    ...main.fl_1,
    ...main.bgWhite,
    marginHorizontal: 15,
    marginTop: screenHeight / 1.8,
    marginBottom: 45
  },
})



const mapStateToProps = state => {
  return {
    targets: state.TargetDebts,
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