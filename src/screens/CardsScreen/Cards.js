import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner, View, Button, Text, CardItem, Card, Body, Item, Label, Input, H3, Icon } from 'native-base'
import moment from 'moment'

import { ToastTr } from '../../components/Toast'
import CardInfo from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { PaymentActions } from '../../actions/PaymentActions'
import { TARGET, IDEBT, OWEME, EDIT } from '../../constants/TargetDebts'
import { styles as main, screenHeight } from '../../Style'


class Cards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      visibleModal: false,
      Amount:'',
      IncreaseId: -1,
      errAmount: false
    }

    this._refreshData = this._refreshData.bind(this)
    this._editItem = this._editItem.bind(this)
    this._addTarget = this._addTarget.bind(this)
    this._addMyDebt = this._addMyDebt.bind(this)
    this._addOweme = this._addOweme.bind(this)
    this._increaseItem = this._increaseItem.bind(this)
    this._hideModal = this._hideModal.bind(this)
    this._chooseItem = this._chooseItem.bind(this)
    this._checkParams = this._checkParams.bind(this)

  }

  componentDidMount(){
    this.props.navigation.setParams({ refreshData: this._refreshData })
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.targets.Error.length > 0) {
      ToastTr.Danger(nextProps.targets.Error)
    } else {
      setTimeout(() => {
        let currMonth = moment().month()+1
        let currYear = moment().year()
        this.props.getpaymentlist(this.props.user.UserId, currYear, currMonth)
      }, 200)
    }
  }

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
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
    this.setState({ visibleModal: false, IncreaseId: -1, Amount: '', errAmount: false })
  }

  _changeAmount = value => {
    this.setState({ Amount: Number(value) })
  }

  _chooseItem(Id) {
    this.setState({ visibleModal: true, IncreaseId: Id })
  }

  _checkParams() {
    st = this.state

    if (st.Amount.length == 0) {
      this.setState({ errAmount: true })
      return false
    }
    return true
  }

  _increaseItem() {
    if(this._checkParams()) {
      this.props.increaseTarget(this.state.IncreaseId, this.state.Amount)
      this._hideModal()
    }
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
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
            }
          >
            <CardInfo itemtype={TARGET} currency={user.DefCurrency} data={target} editItem={this._editItem} addItem={this._addTarget} increaseItem={this._chooseItem} />
            <CardInfo itemtype={IDEBT} currency={user.DefCurrency} data={mydebt} editItem={this._editItem} addItem={this._addMyDebt} increaseItem={this._chooseItem} />
            <CardInfo itemtype={OWEME} currency={user.DefCurrency} data={oweme} editItem={this._editItem} addItem={this._addOweme} increaseItem={this._chooseItem} />
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
                    <Item floatingLabel style={main.width_90prc} error={this.state.errAmount}>
                      <Label>Сумма</Label>
                      <Input style={main.clGrey} keyboardType="number-pad" onChangeText={this._changeAmount} value={this.state.Amount.toString()} />
                    </Item>
                    <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Button block success onPress={this._increaseItem}>
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
  }
})



const mapStateToProps = state => {
  return {
    targets: state.TargetDebts,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTargetDebtList: (UserId) => {
      dispatch(TargetActions.Get(UserId))
    },
    increaseTarget: (Id, Amount) => {
      dispatch(TargetActions.Increase(Id, Amount))
    },
    getpaymentlist: (UserId, year, month) => dispatch(PaymentActions.Get(UserId, year, month))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)