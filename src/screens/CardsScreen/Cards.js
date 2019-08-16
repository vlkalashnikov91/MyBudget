import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet, Alert, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, View, Button, Text, CardItem, Card, Body, Item, ActionSheet, Input, H3, Icon, Fab } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'

import { ToastTr } from '../../components/Toast'
import { CardInfo } from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { PaymentActions } from '../../actions/PaymentActions'
import { TARGET, IDEBT, OWEME } from '../../constants/TargetDebts'
import { SkypeIndicator } from 'react-native-indicators'

import { styles as main, screenHeight, screenWidth, TargetColor, IDebtColor, DebtColor, ivanColor } from '../../Style'
import { SummMask, ClearNums, capitalize } from '../../utils/utils'

var BUTTONS = [
  {text:"Поставить цель", icon:"add", iconColor:"#F04124", type:TARGET},
  {text:"Дать в долг", icon:"calculator", iconColor:"#395971", type:OWEME}, 
  {text:"Взять в долг", icon:"cash", iconColor:"#43ac6a", type:IDEBT},
  {text:"Отмена", icon:"close", iconColor:"#a7a7a7", type: 999}
]


class Cards extends Component {
  constructor(props) {
    super(props)

    this.timer = null

    this.state = {
      refreshing: false,
      visibleModalIncrease: false,
      visibleModalMenu: false,
      Amount:'',
      IncreaseId: -1,
      errAmount: false,
      choosenItem: {},
      Loading: false,
    }

    this._refreshData = this._refreshData.bind(this)
    this._toggleAdd = this._toggleAdd.bind(this)
    this._editItem = this._editItem.bind(this)
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
      this.setState({ Loading: false })

    } else {
      if (this.state.Loading) {
        this.timer = setTimeout(() => {
          this.setState({ Loading: false })
          
          let currMonth = moment().month()+1
          let currYear = moment().year()
          this.props.getpaymentlist(this.props.user.UserId, currYear, currMonth)
        }, 200)

        this._hideModalIncrease()
        this._hideModalMenu()
      }
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timer)
  }

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  _toggleAdd() {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 3,
        title: "Выберите:",
        itemStyle:{color:'red'}
      },
      buttonIndex => {
        if (BUTTONS[buttonIndex].type !== 999) {
          this.props.navigation.navigate('AddItem', {type: BUTTONS[buttonIndex].type})
        }
      }
    )
  }

  _editItem(itemId){
    this.props.navigation.navigate('EditItem', {itemid: itemId})
  }

  _deleteItem(){
    this._hideModalMenu()

    Alert.alert(
      `${capitalize(this.state.choosenItem.GoalName)}`,
      'Удалить цель?',
      [
        {text: 'Нет'},
        {text: 'Да', onPress: () => {
            this.props.deletecard(this.state.choosenItem.Id)
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
    this._hideModalMenu()
  }

  _chngIncreaseAmount = value => {
    this.setState({ Amount: String(Number(ClearNums(value))) })
  }

  _increaseItem() {
    st = this.state
    if ((st.Amount.length == 0) || (Number(st.Amount < 0))) {
      this.setState({ errAmount: true })
    } else {
      this.props.increaseTarget(st.choosenItem.Id, Number(st.Amount))

      this.setState({ Loading: true })
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

    var content = <View style={[main.fl_1, {padding:20}]}><SkypeIndicator color={ivanColor} /></View>

    var target = targets.Targets.filter(item => item.Type === TARGET)
    var mydebt = targets.Targets.filter(item => item.Type === IDEBT)
    var oweme = targets.Targets.filter(item => item.Type === OWEME)
    var allCnt = target.length + mydebt.length + oweme.length

    if (targets.isLoad === false) {
      content = 
        (allCnt > 0)
        ? <>
          <CardInfo itemtype={TARGET} currency={user.DefCurrency} data={target} editItem={this._editItem} showModalMenu={this._showModalMenu} />
          <CardInfo itemtype={IDEBT} currency={user.DefCurrency} data={mydebt} editItem={this._editItem} showModalMenu={this._showModalMenu} />
          <CardInfo itemtype={OWEME} currency={user.DefCurrency} data={oweme} editItem={this._editItem} showModalMenu={this._showModalMenu} />
        </> : (
        <Card transparent>
          <CardItem style={main.fD_C}>
            <FontAwesome name='info-circle' size={80} style={styles.infoIcon}/>
            <Text note style={[main.fontFam, main.txtAl_c]}>В этом блоке можно ставить себе финансовые цели, а также вести учёт Ваших долгов и должников.</Text>
          </CardItem>
        </Card>
        )
    }


    return (
      <Container>
        <Content enableOnAndroid refreshControl = {
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
          }
        >
          {content}
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
              <CardItem header>
                <Text style={[main.fontFam, main.clGrey]}>Введите сумму</Text>
                <Icon button name="close" onPress={this._hideModalIncrease} style={styles.modalCloseIcon} disabled={this.state.Loading}/>
              </CardItem>
              <CardItem>
                <Body style={[main.fD_R, main.aI_C]}>
                  <Item style={main.width_90prc} error={this.state.errAmount}>
                    <Input
                      textAlign={'center'}
                      style={main.clGrey}
                      keyboardType="number-pad"
                      maxLength={10}
                      onChangeText={this._chngIncreaseAmount}
                      value={SummMask(this.state.Amount)}
                      onSubmitEditing={this._increaseItem}
                    />
                  </Item>
                  <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                {(this.state.Loading)
                ? <SkypeIndicator color={ivanColor} />
                : <Button block style={main.bgGreen} onPress={this._increaseItem}>
                    <Text>Пополнить</Text>
                  </Button>
                }
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
              <Text style={main.txtAl_c}>{this.state.choosenItem.GoalName}</Text>
              <Icon button name="close" onPress={this._hideModalMenu} style={styles.modalCloseIcon}/>
            </CardItem>
            <CardItem>
              <Body>
                <Button transparent onPress={this._showModalIncrease}><Text uppercase={false} style={styles.modalButt}>Пополнить</Text></Button>
                <Button transparent disabled><Text uppercase={false} style={styles.modalButt}>Погасить полностью</Text></Button>
                <Button transparent onPress={this._deleteItem}><Text uppercase={false} style={styles.modalButt}>Удалить</Text></Button>
              </Body>
            </CardItem>
          </Card>
        </Modal>

        <Fab
          active={this.state.fabState}
          direction="up"
          style={main.bgGreen}
          position="bottomRight"
          onPress={_=> this._toggleAdd()}
        >
          <Icon name="add" />
        </Fab>
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
  },
  modalButt: {
    ...main.clGrey, 
    ...main.fontFam,
    fontSize:15
  },
  modalCloseIcon: {
    ...main.mr_0,
    ...main.ml_auto,
    ...main.clGrey
  },
  infoIcon: {
    color:'#609AD3', 
    marginBottom:35, 
    marginTop:10, 
    opacity:0.8
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