import React, {Component} from 'react'
import { Animated, StyleSheet, Modal, RefreshControl, Image, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Button, Text, Icon, Card, CardItem, H1, Segment, Left, Right, Header, Body, View, ListItem, Radio } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment'
import 'moment/locale/ru'

import { SkypeIndicator } from 'react-native-indicators'
import { ToastTr } from '../../components/Toast'
import ListPays from '../../components/ListPays'
import YearMonthPicker from '../../components/YearMonthPicker'

import { PaymentActions } from '../../actions/PaymentActions'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { INCOME, EXPENSE } from '../../constants/Payment'

import { styles as main, ivanColor, ivanGray, screenHeight } from '../../Style'
import { capitalize, SummMask } from '../../utils/utils'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

const SORT_ARR = [
  {desc:'Сначала свежие платежи', id:1},
  {desc:'Сначала старые платежи',  id:2},
  {desc:'По возрастанию суммы',  id:3},
  {desc:'По убыванию суммы',  id:4}
]


class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.timer = null

    this.state = {
      selectedDate: moment(),
      refreshing: false,
      visibleModalInfo: false,
      visibleModalSort: false,
      sortId: 1,
    }

    this._refreshData = this._refreshData.bind(this)
    this._navigateToEdit = this._navigateToEdit.bind(this)
    this._nextMonth = this._nextMonth.bind(this)
    this._prevMonth = this._prevMonth.bind(this)
    this._changeMonth = this._changeMonth.bind(this)
  }

  async componentDidMount() {
    const { selectedDate } = this.state
    const { UserId } = this.props.user
    let currMonth = selectedDate.month()+1
    let currYear = selectedDate.year()

    const res = await this.props.getcategories(UserId)
    const res2 = await this.props.getpaymentlist(UserId, currYear, currMonth)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ refreshing: false })

    if (nextProps.payments.Error.length > 0) {
      ToastTr.Danger(nextProps.payments.Error)
    }

  }

  componentWillUnmount(){
    clearTimeout(this.timer)
  }

  _navigateToEdit(Id) {
    this.props.navigation.navigate('EditPayment', {itemid: Id})
  }
  
  _navigateToAdd(type) {
    this.props.navigation.navigate('AddPayment', {type: type})
  }

  _toggleModalInfo = () => {
    this.setState(prevState => ({visibleModalInfo: !prevState.visibleModalInfo}))
  }

  _toggleModalSort = () => {
    this.setState(prevState => ({visibleModalSort: !prevState.visibleModalSort}))
  }

  _changeSort = (id) => {
    this.setState({sortId: id, visibleModalSort: false})
  }

  _sortPays = () => {
    const { sortId } = this.state
    const { Payments } = this.props.payments

    if ((Payments === undefined) && (Payments.length === 0)) {
      return []
    }

    switch(sortId) {
      case 1:
        return Payments.sort((a, b) => moment(a.TransDate) - moment(b.TransDate))
      case 2:
        return Payments.sort((a, b) => moment(b.TransDate) - moment(a.TransDate))
      case 3:
        return Payments.sort((a, b) => Number(a.Amount) > Number(b.Amount))
      case 4:
        return Payments.sort((a, b) => Number(a.Amount) < Number(b.Amount))
      default:
        return Payments
    }
  }

  _nextMonth() {
    let newMonth = moment(this.state.selectedDate).add(1, 'months')
    this._changeMonth(newMonth)
  }

  _prevMonth() {
    let newMonth = moment(this.state.selectedDate).subtract(1, 'months')
    this._changeMonth(newMonth)
  }

  _changeMonth(newDate){
    this.setState({ selectedDate: newDate })

    let currMonth = newDate.month()+1
    let currYear = newDate.year()
    this.props.getpaymentlist(this.props.user.UserId, currYear, currMonth)
  }

  _refreshData() {
    let currMonth = this.state.selectedDate.month()+1
    let currYear = this.state.selectedDate.year()
    this.props.getpaymentlist(this.props.user.UserId, currYear, currMonth)
  }

  _showModalCalendar = () => {
    let selectedDate = this.state.selectedDate

    let startYear = Number(moment(selectedDate).subtract(5, 'years').format('YYYY'))
    let endYear = Number(moment(selectedDate).add(5, 'years').format('YYYY'))
    let selectedYear = Number(moment(selectedDate).format('YYYY'))
    let selectedMonth = Number(moment(selectedDate).format('M'))-1

    this.picker
      .show({startYear, endYear, selectedYear, selectedMonth})
      .then(({year, month}) => {
        let newDate = moment([year, month, 1])

        this._changeMonth(newDate)
      })
  }

  render() {
    const { payments, categories, user } = this.props
    const { visibleModalInfo, selectedDate, refreshing, visibleModalSort, sortId } = this.state

    const isLoad = payments.isLoad || categories.isLoad || user.isLoad

    var Pays = <SkypeIndicator color={ivanColor} />
    
    if (!isLoad) {
      if (payments.Payments.length == 0) {
        Pays = <Grid style={main.mt_20}><Col><Row style={[main.jC_C, main.fD_R]}><Text note>В этом месяце ещё нет платежей</Text></Row></Col></Grid>
      } else {
        var sortPays = this._sortPays()
        Pays = <ListPays payments={sortPays} GoToEdit={this._navigateToEdit} sort={sortId} /> /*sort - добавлен просто так чтобы class ListPays обновлялся, функция componentWillReceiveProps срабатывала */
      }
    }

    var balance = 0
    var planed = 0

    if ((payments.Payments != undefined) && (payments.Payments.length > 0)) {
      payments.Payments.map(item => {
        if (item.IsPlaned == false) {
          if (item.IsSpending) {
            balance = balance - item.Amount
          } else {
            balance = balance + item.Amount
          }
        }

        if (item.IsSpending) {
          planed = planed - item.Amount
        } else {
          planed = planed + item.Amount
        }
      })
    }

    return (
        <Container>
          <Header>
            <View style={[main.fl_1, main.fD_R, {alignSelf: 'center'}]}>
              <Image resizeMode='contain' resizeMethod='scale' style={main.imageForHeader} source={require('../../../assets/Logo_min2.png')} />
              <Grid style={[main.pdL_15, main.pdR_15]}>
                <Row>
                  <Col>
                    <Text style={styles.balanceStyle}>Баланс</Text>
                  </Col>
                  <Col>
                    <Text style={styles.balanceStyle}>Плановый</Text>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Text style={[main.clWhite, main.txtAl_c, main.fontFamBold]}>{SummMask(balance)} {user.DefCurrency}</Text>
                  </Col>
                  <Col>
                    <Text style={[main.clWhite, main.txtAl_c]}>{SummMask(planed)} {user.DefCurrency}</Text>
                  </Col>
                </Row>
              </Grid>

              <Menu>
                <MenuTrigger>
                  <View style={[main.fD_R, main.aI_C, {height:45, paddingLeft:7, paddingRight:7}]}>
                    <SimpleLineIcons name="options-vertical" style={main.clWhite} size={16}/>
                  </View>
                </MenuTrigger>
                <MenuOptions customStyles={{optionWrapper: {padding: 10, flexDirection:'row', alignItems:'center'}}}>
                  <MenuOption onSelect={this._toggleModalSort}><MaterialCommunityIcons name="sort" style={[main.mr_15, main.clBlue]} size={20} /><Text>Сортировать</Text></MenuOption>
                  <MenuOption onSelect={this._toggleModalInfo}><SimpleLineIcons name="question" style={[main.mr_15, main.clBlue]} size={20} /><Text>Помощь</Text></MenuOption>
                </MenuOptions>
              </Menu>

            </View>
          </Header>
          <Segment style={main.bgWhite}>
            <Left>
              <Button transparent disabled={(isLoad)} onPress={this._prevMonth} style={styles.prevMonthBtn}>
                <FontAwesome name="angle-left" size={27} />
              </Button>
            </Left>
            <H1 style={styles.monthHeader} button disabled={(isLoad)} onPress={this._showModalCalendar}>
              {capitalize(moment(selectedDate).format("MMMM YYYY"))}
            </H1>
            <Right>
              <Button transparent disabled={(isLoad)} style={styles.nextMonthBtn} onPress={this._nextMonth}>
                <FontAwesome name="angle-right" size={27} />
              </Button>
            </Right>
          </Segment>

          <Content
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this._refreshData} />
            }
          >
            <Card transparent>
              <CardItem>
                <Grid>
                  <Row>
                    <Col>
                      <Row style={[main.jC_C, main.aI_C]}>
                        <Button iconLeft disabled={(isLoad)} style={(!isLoad)? main.bgGreen : {}} rounded onPress={_=> this._navigateToAdd(INCOME)}>
                          <Icon ios="ios-add" android="md-add" />
                          <Text uppercase={true}>Доход </Text>
                        </Button>
                      </Row>
                    </Col>
                    <Col>
                      <Row style={[main.jC_C, main.aI_C]}>
                        <Button iconRight disabled={(isLoad)} style={(!isLoad)? main.bgDanger : {}} rounded onPress={_=> this._navigateToAdd(EXPENSE)}>
                          <Text uppercase={true}>Расход</Text>
                          <Icon ios="ios-remove" android="md-remove" />
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
            </Card>
            
            {Pays}

          </Content>

          <YearMonthPicker ref={(picker) => this.picker=picker} />


          <Modal animationType="fade" transparent={true} visible={visibleModalInfo} onRequestClose={this._toggleModalInfo} >
            <View style={main.modalOverlay} />
            <Card transparent style={styles.modalMenu}>
              <CardItem header>
                <Text style={main.fontFamBold}>Планирование</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>"Плановый" баланс позволяет отследить остаток средств с учетом еще не проведенных, но запланированных выплат.</Text>
                  <View style={[main.fD_R, main.aI_C]}>
                    <Button rounded bordered success={false} light={true} style={styles.chooseButton}>
                      <Icon ios="ios-checkmark" android="md-checkmark" style={styles.checkmark}/>
                    </Button>
                    <Text>Запланированный платеж</Text>
                  </View>
                  <View style={[main.fD_R, main.aI_C]}>
                    <Button rounded bordered success={true} light={false} style={styles.chooseButton} >
                      <Icon ios="ios-checkmark" android="md-checkmark" style={styles.checkmark}/>
                    </Button>
                    <Text>Проведенный платеж</Text>
                  </View>
                  <Text>Чтобы перевести платеж в статус "запланированный" нажмите на галочку перед наименованием платежа.</Text>
                </Body>
              </CardItem>
              <CardItem style={[main.fD_R,{justifyContent:'flex-end'}]}>
                <Button transparent onPress={this._toggleModalInfo}>
                  <Text>Ясно</Text>
                </Button>
              </CardItem>
            </Card>
        </Modal>

        <Modal animationType="fade" transparent={true} visible={visibleModalSort} onRequestClose={this._toggleModalSort} >
          <View style={main.modalOverlay}/>
          <Card transparent style={styles.modalMenu}>
            <CardItem header>
              <Text style={main.fontFamBold}>Сортировка</Text>
              <Icon button name="close" onPress={this._toggleModalSort} style={styles.modalCloseIcon}/>
            </CardItem>
            <CardItem>
              <FlatList
                data={SORT_ARR}
                keyExtractor = {(item, index) => 'sort-'+index}
                renderItem={({item}) => {
                  return (
                    <ListItem noBorder={true} onPress={_=>this._changeSort(item.id)} >
                      <Left><Text>{item.desc}</Text></Left>
                      <Right><Radio selected={(sortId===item.id)} selectedColor={ivanColor} color={ivanGray} onPress={_=>this._changeSort(item.id)} /></Right>
                    </ListItem>
                  )
                }}
              />
            </CardItem>
          </Card>
        </Modal>

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  monthHeader: {
    marginTop: 11
  },
  prevMonthBtn: {
    ...main.clGrey,
    ...main.mr_auto,
    ...main.ml_0,
    ...main.pdL_25,
    ...main.pdR_10
  },
  nextMonthBtn: {
    ...main.clGrey,
    ...main.ml_auto,
    ...main.mr_0,
    ...main.pdL_10,
    ...main.pdR_25
  },
  balanceStyle: {
    ...main.clWhite, 
    ...main.txtAl_c, 
    fontSize: 13
  },
  modalMenu: {
    ...main.bgWhite,
    marginTop: screenHeight / 7,
    ...main.ml_10,
    ...main.mr_10
  },
  chooseButton: {
    ...main.ml_10, 
    marginRight: 10,
    height: 31,
    width: 31,
    paddingHorizontal: 9,
    marginVertical: 7
  },
  modalCloseIcon: {
    ...main.mr_0,
    ...main.ml_auto,
    ...main.clGrey
  },
  checkmark: {
    fontSize:18, 
    marginLeft:0, 
    marginRight:0, 
    marginTop:0
  }
})

const mapStateToProps = state => {
  return {
    user: state.User,
    payments: state.Payments,
    categories: state.Categories
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getpaymentlist: (UserId, year, month) => dispatch(PaymentActions.Get(UserId, year, month)),
    deletepayment: (id) => dispatch(PaymentActions.Delete(id)),
    editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => {
      dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned))
    },
    getcategories: (UserId) => dispatch(CategoriesActions.Get(UserId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)