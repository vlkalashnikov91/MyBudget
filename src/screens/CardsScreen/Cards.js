import React, {Component} from 'react'
import { RefreshControl, Modal, StyleSheet, Alert, Platform, Keyboard, ToolbarAndroid } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, View, Button, Text, CardItem, Card, Body, Item, ActionSheet, Input, H3, Icon, Fab, Header, Title, Right } from 'native-base'
import { FontAwesome, MaterialIcons, SimpleLineIcons, Ionicons } from '@expo/vector-icons'
import moment from 'moment'

import { ToastTr } from '../../components/Toast'
import { CardInfo } from '../../components/CardInfo'
import { TargetActions, GetFinished, AddToFinished } from '../../actions/TargetActions'
import { PaymentActions } from '../../actions/PaymentActions'
import { TARGET, IDEBT, OWEME } from '../../constants/TargetDebts'
import { SkypeIndicator } from 'react-native-indicators'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

import { styles as main, screenHeight, screenWidth, ivanColor, IDebtColor, TargetColor, DebtColor } from '../../Style'
import { SummMask, ClearSpace, capitalize, onlyNumbers } from '../../utils/utils'


var BUTTONS = [
  {text:"Поставить цель", icon:"add", iconColor:TargetColor, type:TARGET},
  {text:"Взять в долг", icon:"add", iconColor:IDebtColor, type:IDEBT},
  {text:"Дать в долг", icon:"add", iconColor:DebtColor, type:OWEME}, 
  {text:"Отмена", icon:"close", iconColor:"#a7a7a7", type: 999}
]


class Cards extends Component {
  constructor(props) {
    super(props)

    this.timer = null
    this.timer2 = null
    this.timer3 = null

    this.state = {
      refreshing: false,
      visibleModalIncrease: false,
      visibleModalMenu: false,
      Amount:'',
      errAmount: false,
      choosenItem: {},
      Loading: false,
      isShowArchive: false,
      finishedTargets:[]
    }

    this._refreshData = this._refreshData.bind(this)
    this._toggleAdd = this._toggleAdd.bind(this)
    this._toggleShowArchive = this._toggleShowArchive.bind(this)
    this._editItem = this._editItem.bind(this)
    this._increaseItem = this._increaseItem.bind(this)
    this._repayFull = this._repayFull.bind(this)
    this._hideModalIncrease = this._hideModalIncrease.bind(this)
    this._showModalIncrease = this._showModalIncrease.bind(this)
    this._hideModalMenu = this._hideModalMenu.bind(this)
    this._showModalMenu = this._showModalMenu.bind(this)
    this._deleteItem = this._deleteItem.bind(this)
    this._checkFinishTarget = this._checkFinishTarget.bind(this)

  }

  async componentDidMount(){
    this.props.getTargetDebtList(this.props.user.UserId)
    this.setState({finishedTargets: await GetFinished()})
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

      this.timer2 = setTimeout(() => {
        this._checkFinishTarget(nextProps.targets.Targets)
      }, 3000)
    }
  }

  componentWillUnmount(){
    clearTimeout(this.timer)
    clearTimeout(this.timer2)
    clearTimeout(this.timer3)
  }

  /* Функция отбора целей по которым надо уведомить пользователя*/
  _checkFinishTarget(targets) {
    let arr = targets.filter(item=> (item.CompleteDate !== null)).map(item=>{
        let needFire = moment().diff(moment(item.CompleteDate))
        needFire = Math.trunc(moment.duration(needFire).asDays())
        if (needFire < 7) {
          return item
        }
    })
    this._setModalInfo(arr)
  }

  /*Функция уведомления пользователя по целям по которым подходит или прошел срок */
  _setModalInfo = (targets) => {
    /*Исключаем те по которым уже направляли уведомления */
    var arr = targets.filter(item=>item!==undefined).filter(t=>t.IsActive===true).filter(k=>!this.state.finishedTargets.includes(k.Id))
    var str = `По ${(arr.length>1)?'целям':'цели'}`

    arr.forEach((item, index)=> {
      str = str +' "'+ item.GoalName + '"'
      if (index < (arr.length-1)) {
        str = str + ','
      }
    })
    str = str + ` срок подходит к завершению.`

    if(arr.length>0) {
      Alert.alert(
        'Срок',
        str,
        [
          {text: 'ОК'},
        ]
      )

      let arr2 = Array.from(this.state.finishedTargets)
      arr.forEach(item=> {
        AddToFinished(item.Id)
        arr2.push(item.Id)
      })

      this.setState(prevState => ({finishedTargets: arr2}))
    }
  }

  _refreshData() {
    this.props.getTargetDebtList(this.props.user.UserId)
  }

  _toggleShowArchive() {
    this.setState(prevState => ({ isShowArchive: !prevState.isShowArchive }))
  }

  _toggleAdd() {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: 3,
        //title: "Выберите:",
        itemStyle:{color:'red'}
      },
      buttonIndex => {
        if (BUTTONS[buttonIndex].type !== 999) {
          this.props.navigation.navigate('AddItem', {type: BUTTONS[buttonIndex].type})
        }
      }
    )
  }

  /* Редактировать цель */
  _editItem(itemId){
    this.props.navigation.navigate('EditItem', {itemid: itemId})
  }

  /* Удалить цель */
  _deleteItem(){
    Alert.alert(
      `${capitalize(this.state.choosenItem.GoalName)}`,
      'Удалить цель?',
      [
        {text: 'Нет', onPress:() => {
          this._hideModalMenu()
        }},
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
    if (this.state.choosenItem.IsActive) {
      this.setState({ visibleModalIncrease: true })
      this._hideModalMenu()
    }
  }

  /*Полное погашение */
  _repayFull() {
    st = this.state

    if (st.choosenItem.IsActive) {
      this.setState({Amount: String(Number(st.choosenItem.Amount) - Number(st.choosenItem.CurAmount))})
      this.timer3 = setTimeout(() => {
        this._increaseItem()
        this._hideModalMenu()
      }, 200)
    }
  }

  _chngIncreaseAmount = value => {
    var val = ClearSpace(value)
    if (val.length === 0) {
      this.setState({ Amount: '' })
    } else {
      if (onlyNumbers(val)) {
        this.setState({ Amount: String(Number(val)) })
      }
    }
  }

  /* Пополнить цель */
  _increaseItem() {
    st = this.state
    if ((st.Amount.length == 0) || (Number(st.Amount < 0))) {
      this.setState({ errAmount: true })
      return
    }

    if (Number(st.choosenItem.Amount) < (Number(st.Amount) + Number(st.choosenItem.CurAmount))) {
      this.setState({ errAmount: true })
      ToastTr.Default(`Невозможно пополнить на сумму больше чем ${SummMask(st.choosenItem.Amount)} ${this.props.user.DefCurrency}`)
      Keyboard.dismiss()
      return
    }

    this.props.increaseTarget(st.choosenItem.Id, Number(st.Amount))
    Keyboard.dismiss()
    this.setState({ Loading: true })
  }

  /*Показать меню */
  _showModalMenu(item) {
    this.setState(prevState => ({ visibleModalMenu: true, choosenItem: item, Amount: ''}))
  }

  _hideModalMenu() {
    this.setState(prevState => ({ visibleModalMenu: false }))
  }

  _navigateInfo = () => {
    this.props.navigation.navigate('HelpCard')
    
  }

  render() {
    const { targets, user } = this.props
    const { isShowArchive, refreshing, visibleModalIncrease, visibleModalMenu, choosenItem, fabState, Amount, errAmount, Loading } = this.state

    var content = <View style={[main.fl_1, {padding:20}]}><SkypeIndicator color={ivanColor} /></View>

    var target = targets.Targets.filter(item => item.Type === TARGET)
    var mydebt = targets.Targets.filter(item => item.Type === IDEBT)
    var oweme = targets.Targets.filter(item => item.Type === OWEME)

    var Atarget = target.filter(item => item.IsActive===true)
    var Amydebt = mydebt.filter(item => item.IsActive===true)
    var Aoweme = oweme.filter(item => item.IsActive===true)
    var allCnt = 0 

    if (isShowArchive) {
      allCnt = target.length + mydebt.length + oweme.length
    } else {
      allCnt = Atarget.length + Amydebt.length + Aoweme.length
    }

    if (targets.isLoad === false) {
      content = 
        (allCnt > 0)
        ? <>
          <CardInfo itemtype={TARGET} showArchive={isShowArchive} currency={user.DefCurrency} data={target} editItem={this._editItem} showModalMenu={this._showModalMenu} />
          <CardInfo itemtype={IDEBT} showArchive={isShowArchive} currency={user.DefCurrency} data={mydebt} editItem={this._editItem} showModalMenu={this._showModalMenu} />
          <CardInfo itemtype={OWEME} showArchive={isShowArchive} currency={user.DefCurrency} data={oweme} editItem={this._editItem} showModalMenu={this._showModalMenu} />
        </> : (
        <Card transparent>
          <CardItem style={main.fD_C}>
            <FontAwesome name='info-circle' size={80} style={styles.infoIcon}/>
            <Text note style={main.txtAl_c}>В этом блоке можно ставить себе финансовые цели, а также вести учёт Ваших долгов и должников.</Text>
          </CardItem>
        </Card>
        )
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title style={main.ml_15}>Мои цели</Title>
          </Body>
          <Right>
            <Menu>
              <MenuTrigger>
                <View style={[main.fD_R, main.aI_C, {height:45, paddingLeft:7, paddingRight:7}]}>
                  <SimpleLineIcons name="options-vertical" style={main.clWhite} size={16}/>
                </View>
              </MenuTrigger>
              <MenuOptions customStyles={{optionWrapper: {padding: 10, flexDirection:'row', alignItems:'center'}}}>
                <MenuOption onSelect={this._toggleShowArchive}>
                  {(isShowArchive)
                  ?<MaterialIcons name="check-box" style={[main.mr_15, main.clBlue]} size={20} />
                  :<MaterialIcons name="check-box-outline-blank" style={[main.mr_15, main.clBlue]} size={20} />}
                  <Text>Архивные цели</Text>
                </MenuOption>
                <MenuOption onSelect={this._navigateInfo}>
                  <SimpleLineIcons name="question" style={[main.mr_15, main.clBlue]} size={20} />
                  <Text>Помощь</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>

          </Right>
        </Header>
        <Content enableOnAndroid refreshControl = {
            <RefreshControl refreshing={refreshing} onRefresh={this._refreshData} />
          }
        >
          {content}
        </Content>

        <Modal animationType="slide"
          transparent={true}
          visible={visibleModalIncrease}
          onRequestClose={this._hideModalIncrease}
          avoidKeyboard
        >
          <View style={main.modalOverlay} />
          <Content enableOnAndroid extraHeight={Platform.select({ android: 150 })}>
            <Card transparent style={styles.modalWindow}>
              <CardItem header>
                <Text>{choosenItem.GoalName}</Text>
                <Icon button name="close" onPress={this._hideModalIncrease} style={styles.modalCloseIcon} disabled={Loading}/>
              </CardItem>
              <CardItem>
                <Body style={[main.fD_R, main.aI_C]}>
                  <Item style={main.width_90prc} error={errAmount}>
                    <Input
                      textAlign={'center'}
                      keyboardType="number-pad"
                      placeholder="Введите сумму"
                      placeholderTextColor="#a7a7a7"
                      maxLength={10}
                      onChangeText={this._chngIncreaseAmount}
                      value={SummMask(Amount)}
                      onSubmitEditing={this._increaseItem}
                      style={{fontSize:25}}
                    />
                  </Item>
                  <H3>{user.DefCurrency}</H3>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Button block success={(!Loading)} transparent={(Loading)} onPress={(Loading)?null:this._increaseItem}>
                    {(Loading) ? <SkypeIndicator color={ivanColor}/> : <Text>Пополнить</Text>}
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </Modal>

        <Modal animationType="fade"
          transparent={true}
          visible={visibleModalMenu}
          onRequestClose={this._hideModalMenu}
        >
          <View style={main.modalOverlay} />
          <Card transparent style={styles.modalMenu}>
            <CardItem header>
              <Text style={[main.txtAl_c, main.fontFamBold]} numberOfLines={1}>{choosenItem.GoalName}</Text>
              <Icon button name="close" onPress={this._hideModalMenu} style={styles.modalCloseIcon}/>
            </CardItem>
            <CardItem>
              <Body>
                <Button transparent onPress={this._showModalIncrease}><Text uppercase={false} style={(choosenItem.IsActive)?styles.modalButt:styles.modalButtDis}>Пополнить</Text></Button>
                <Button transparent onPress={this._repayFull}><Text uppercase={false} style={(choosenItem.IsActive)?styles.modalButt:styles.modalButtDis}>Погасить полностью</Text></Button>
                <Button transparent onPress={this._deleteItem}><Text uppercase={false} style={styles.modalButt}>Удалить</Text></Button>
              </Body>
            </CardItem>
          </Card>
        </Modal>

        <Fab active={fabState} direction="up" style={main.bgGreen} position="bottomRight" onPress={_=> this._toggleAdd()} >
          <Icon name="add"/>
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
    marginBottom: screenHeight / 7 //45
  },
  modalMenu: {
    ...main.bgWhite,
    width: screenWidth / 1.2, 
    height: screenHeight / 3.5, 
    marginTop: screenHeight / 4, 
    marginLeft: (screenWidth - (screenWidth / 1.2)) / 2
  },
  modalButt: {
    fontSize:15,
    ...main.clIvan
  },
  modalButtDis: {
    fontSize:15,
    color:'#A7A7A7'
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
  },
  modalMenu2: {
    ...main.bgWhite,
    marginTop: screenHeight / 7,
    ...main.ml_10,
    ...main.mr_10
  },
  chooseButton: {
    ...main.ml_10, 
    marginRight: 10,
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