import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet, Alert, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner, View, Button, Text, CardItem, Card, Body, Item, Label, Input, H3, Icon } from 'native-base'
import moment from 'moment'

import { ToastTr } from '../../components/Toast'
import CardInfo from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { PaymentActions } from '../../actions/PaymentActions'
import { TARGET, IDEBT, OWEME, EDIT } from '../../constants/TargetDebts'
import { styles as main, screenHeight, screenWidth } from '../../Style'
import { capitalize } from '../../utils/utils'


class Cards extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false,
      visibleModalIncrease: false,
      visibleModalMenu: false,
      Amount:'',
      IncreaseId: -1,
      errAmount: false,
      choosenItem: {}
    }

    this._refreshData = this._refreshData.bind(this)
    this._editItem = this._editItem.bind(this)
    this._addTarget = this._addTarget.bind(this)
    this._addMyDebt = this._addMyDebt.bind(this)
    this._addOweme = this._addOweme.bind(this)
    this._increaseItem = this._increaseItem.bind(this)
    this._hideModalIncrease = this._hideModalIncrease.bind(this)
    this._showModalIncrease = this._showModalIncrease.bind(this)
    this._hideModalMenu = this._hideModalMenu.bind(this)
    this._showModalMenu = this._showModalMenu.bind(this)
    this._deleteItem = this._deleteItem.bind(this)

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

  _deleteItem(){
    Alert.alert(
      `${capitalize(this.state.choosenItem.GoalName)}`,
      'Удалить цель?',
      [
        {text: 'Нет'},
        {text: 'Да', onPress: () => {
            this.props.deletecard(this.state.choosenItem.Id)
            this._hideModalMenu()
          }
        },
      ]
    )
  }

  _hideModalIncrease() {
    this.setState({ visibleModalIncrease: false, Amount: '', errAmount: false })
  }

  _showModalIncrease() {
    this.setState({ visibleModalIncrease: true })
  }

  _chngIncreaseAmount = value => {
    this.setState({ Amount: value })
  }

  _increaseItem() {
    st = this.state
    if ((st.Amount.length == 0) || (Number(st.Amount < 0))) {
      this.setState({ errAmount: true })
    } else {
      this.props.increaseTarget(st.choosenItem.Id, Number(st.Amount))
      this._hideModalIncrease()
      this._hideModalMenu()
    }
  }

  _showModalMenu(item) {
    this.setState({ visibleModalMenu: true, choosenItem: item})
  }

  _hideModalMenu() {
    this.setState({ visibleModalMenu: false, choosenItem: {}})
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
          <Content refreshControl = {
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
            }
            enableOnAndroid
          >
            <CardInfo itemtype={TARGET} currency={user.DefCurrency} data={target} editItem={this._editItem} addItem={this._addTarget} showModalMenu={this._showModalMenu} />
            <CardInfo itemtype={IDEBT} currency={user.DefCurrency} data={mydebt} editItem={this._editItem} addItem={this._addMyDebt} showModalMenu={this._showModalMenu} />
            <CardInfo itemtype={OWEME} currency={user.DefCurrency} data={oweme} editItem={this._editItem} addItem={this._addOweme} showModalMenu={this._showModalMenu} />
          </Content>

          <Modal animationType="slide"
            transparent={true}
            visible={this.state.visibleModalIncrease}
            onRequestClose={this._hideModalIncrease}
            avoidKeyboard
          >
            <View style={main.modalOverlay} />
            <Content enableOnAndroid extraHeight={Platform.select({ android: 150 })}>
              <Card transparent style={styles.modalWindow}>
                <CardItem bordered>
                  <Text>Пополнение</Text>
                  <Icon button name="close" onPress={this._hideModalIncrease} style={[main.mr_0, main.ml_auto, main.clGrey]}/>
                </CardItem>
                <CardItem>
                  <Body style={[main.fD_R, main.aI_C]}>
                    <Item floatingLabel style={main.width_90prc} error={this.state.errAmount}>
                      <Label>Сумма</Label>
                      <Input style={main.clGrey} keyboardType="number-pad" onChangeText={this._chngIncreaseAmount} value={this.state.Amount} onSubmitEditing={this._increaseItem}/>
                    </Item>
                    <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Button block style={main.bgGreen} onPress={this._increaseItem}>
                      <Text>Пополнить</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Modal>

          <Modal animationType="fade"
            transparent={true}
            visible={this.state.visibleModalMenu}
            onRequestClose={this._hideModalMenu}
          >
          <View style={main.modalOverlay} />
          <Card transparent style={styles.modalMenu}>
            <CardItem header>
              <Text>{this.state.choosenItem.GoalName}</Text>
              <Icon button name="close" onPress={this._hideModalMenu} style={[main.mr_0, main.ml_auto, main.clGrey]}/>
            </CardItem>
            <CardItem>
              <Body>
                <Button transparent onPress={this._showModalIncrease}><Text uppercase={false} style={[main.clGrey, {fontSize:15}]}>Пополнить</Text></Button>
                <Button transparent disabled><Text uppercase={false} style={[main.clGrey, {fontSize:15}]}>Погасить полностью</Text></Button>
                <Button transparent onPress={this._deleteItem}><Text uppercase={false} style={[main.clGrey, {fontSize:15}]}>Удалить</Text></Button>
              </Body>
            </CardItem>
          </Card>
        </Modal>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  modalWindow: {
    ...main.bgWhite,
    marginHorizontal: 15,
    marginTop: screenHeight / 1.8,
    height: screenHeight / 3.5, 
    marginBottom: 45
  },
  modalMenu: {
    ...main.bgWhite,
    width: screenWidth / 1.2, 
    height: screenHeight / 3.5, 
    marginTop: screenHeight / 4, 
    marginLeft: (screenWidth - (screenWidth / 1.2)) / 2
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
    deletecard: (Id) => {
      dispatch(TargetActions.Delete(Id))
    },
    getpaymentlist: (UserId, year, month) => dispatch(PaymentActions.Get(UserId, year, month))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)