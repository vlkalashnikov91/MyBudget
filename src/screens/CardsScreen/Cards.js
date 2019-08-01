import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet, Alert, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Spinner, View, Button, Text, CardItem, Card, Body, Item, Label, Input, H3, Icon, Fab } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'

import { ToastTr } from '../../components/Toast'
import { CardInfo } from '../../components/CardInfo'
import { TargetActions } from '../../actions/TargetActions'
import { PaymentActions } from '../../actions/PaymentActions'
import { TARGET, IDEBT, OWEME } from '../../constants/TargetDebts'

import { styles as main, screenHeight, screenWidth, TargetColor, IDebtColor, DebtColor } from '../../Style'
import { SummMask, ClearNums, capitalize } from '../../utils/utils'


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
      choosenItem: {},
      Loading: false,
      visibleModalAdd: false,
      
    }

    this._refreshData = this._refreshData.bind(this)
    this._toggleAdd = this._toggleAdd.bind(this)
    this._editItem = this._editItem.bind(this)
    this._addTarget = this._addTarget.bind(this)
    this._increaseItem = this._increaseItem.bind(this)
    this._hideModalIncrease = this._hideModalIncrease.bind(this)
    this._showModalIncrease = this._showModalIncrease.bind(this)
    this._hideModalMenu = this._hideModalMenu.bind(this)
    this._hideModalAdd = this._hideModalAdd.bind(this)
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
        setTimeout(() => {
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

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  _addTarget(type) {
    this._hideModalAdd()
    this.props.navigation.navigate('AddItem', {type: type})
  }

  _toggleAdd() {
    this.setState({ visibleModalAdd: true })
  }

  _editItem(itemId){
    this.props.navigation.navigate('EditItem', {itemid: itemId})
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

  _hideModalAdd() {
    this.setState({ visibleModalAdd: false})
  }

  render() {
    const { targets, user } = this.props

    if (targets.isLoad) {
      return <Spinner />
    }

    var target = targets.Targets.filter(item => item.Type === TARGET)
    var mydebt = targets.Targets.filter(item => item.Type === IDEBT)
    var oweme = targets.Targets.filter(item => item.Type === OWEME)
    var allCnt = target.length + mydebt.length + oweme.length


    return (
        <Container>
          <Content enableOnAndroid refreshControl = {
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
            }
          >
            {(allCnt > 0)
            ? <>
              <CardInfo itemtype={TARGET} currency={user.DefCurrency} data={target} editItem={this._editItem} showModalMenu={this._showModalMenu} />
              <CardInfo itemtype={IDEBT} currency={user.DefCurrency} data={mydebt} editItem={this._editItem} showModalMenu={this._showModalMenu} />
              <CardInfo itemtype={OWEME} currency={user.DefCurrency} data={oweme} editItem={this._editItem} showModalMenu={this._showModalMenu} />
            </> : (
            <Card transparent>
              <CardItem style={main.fD_C}>
                <FontAwesome name='info-circle' size={80} style={{color:'#609AD3', marginBottom:35, marginTop:10, opacity:0.8}}/>
                <Text note style={[main.fontFam, main.txtAl_c]}>В этом блоке можно ставить себе финансовые цели, а также вести учёт Ваших долгов и должников.</Text>
              </CardItem>
            </Card>
            )
          }
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
                  <Icon button name="close" onPress={this._hideModalIncrease} style={[main.mr_0, main.ml_auto, main.clGrey]} disabled={this.state.Loading}/>
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
                  ? <Spinner />
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
              <Icon button name="close" onPress={this._hideModalMenu} style={[main.mr_0, main.ml_auto, main.clGrey]}/>
            </CardItem>
            <CardItem>
              <Body>
                <Button transparent onPress={this._showModalIncrease}><Text uppercase={false} style={[main.clGrey, main.fontFam, {fontSize:15}]}>Пополнить</Text></Button>
                <Button transparent disabled><Text uppercase={false} style={[main.clGrey, main.fontFam, {fontSize:15}]}>Погасить полностью</Text></Button>
                <Button transparent onPress={this._deleteItem}><Text uppercase={false} style={[main.clGrey, main.fontFam, {fontSize:15}]}>Удалить</Text></Button>
              </Body>
            </CardItem>
          </Card>
        </Modal>

        <Modal animationType="fade"
          transparent={true}
          visible={this.state.visibleModalAdd}
          onRequestClose={this._hideModalAdd}
        >
          <View style={main.modalOverlay} />
          <Card transparent style={styles.modalMenu}>
            <CardItem header>
              <Text>Выберите</Text>
              <Icon button name="close" onPress={this._hideModalAdd} style={[main.mr_0, main.ml_auto, main.clGrey]}/>
            </CardItem>
            <CardItem>
              <Body>
                <Button full transparent style={main.jC_start} onPress={_=> this._addTarget(TARGET)}><Text uppercase={false} style={styles.targetButt}>Поставить цель</Text></Button>
                <Button full transparent style={main.jC_start} onPress={_=> this._addTarget(OWEME)}><Text uppercase={false} style={styles.owemeButt}>Дать в долг</Text></Button>
                <Button full transparent style={main.jC_start} onPress={_=> this._addTarget(IDEBT)}><Text uppercase={false} style={styles.idebtButt}>Взять в долг</Text></Button>
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
  targetButt: {
    ...main.fontFamBold,
    fontSize:16, 
    color:TargetColor
  },
  owemeButt: {
    ...main.fontFamBold,
    fontSize:16, 
    color:DebtColor
  },
  idebtButt: {
    ...main.fontFamBold,
    fontSize:16, 
    color:IDebtColor
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