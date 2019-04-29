import React, {Component} from 'react'
import { Alert, StyleSheet, Modal, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Button, Text, Icon, Card, CardItem, H3, View, Spinner, Segment, Left, Right } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import MonthSelectorCalendar from 'react-native-month-selector'
import moment from 'moment'
import 'moment/locale/ru'

import { ToastTr } from '../../components/Toast'
import ListPays from '../../components/ListPays'
import { PaymentActions } from '../../actions/PaymentActions'

import { styles as main } from '../../Style'
import { capitalize } from '../../utils/utils'
import BalanceInfo from '../../components/BalanceInfo'

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedDate: moment(),
      visibleCalendar: false,
      refreshing: false,
      payments: this.props.payments
    }

    this._refreshData = this._refreshData.bind(this)
    this._navigateToEdit = this._navigateToEdit.bind(this)
    this._navigateToIncome = this._navigateToIncome.bind(this)
    this._navigateToExpense = this._navigateToExpense.bind(this)
    this._nextMonth = this._nextMonth.bind(this)
    this._prevMonth = this._prevMonth.bind(this)
    this._changeMonth = this._changeMonth.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
      headerTitle: <BalanceInfo />,
      headerRight: (
        <Icon android='md-information-circle' 
          ios='ios-information-circle' 
          style={[main.clWhite, {marginRight:15}]} 
          button onPress={navigation.getParam('showModalInfo')}
        />
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ showModalInfo: this._setModalInfo })

    setTimeout(() => {
      this._refreshData()
    }, 200)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ refreshing: false })

    if (nextProps.payments.Error.length > 0) {
      ToastTr.Danger(nextProps.payments.Error)
    }

  }

  _navigateToEdit(Id, type) {
    this.props.navigation.navigate('AddEditPayment', {type: type, itemid: Id})
  }
  
  _navigateToIncome() {
    this._navigateToEdit(null, 'income')
  }

  _navigateToExpense() {
    this._navigateToEdit(null, 'expense')
  }

  _setModalInfo = () => {
    Alert.alert(
        'Планирование',
        '"Плановый" баланс позволяет отследить остаток средств с учетом еще не проведенных, но запланированных выплат.\n   ✓ Проведенный платеж \n   ✓ Запланированный платеж\n\nЧтобы перевести платеж в статус "запланированный" нажмите на галочку перед наименованием платежа.',
        [
            {text: 'Ясно'},
        ]
    )
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

    this._hideModalCalendar()
  }

  _refreshData() {
    let currMonth = this.state.selectedDate.month()+1
    let currYear = this.state.selectedDate.year()
    this.props.getpaymentlist(this.props.user.UserId, currYear, currMonth)
  }

  _showModalCalendar = () => {
    this.setState({ visibleCalendar: true })
  }

  _hideModalCalendar = () => {
    this.setState({ visibleCalendar: false })
  }


  render() {
    const { payments } = this.props
    const sortPays = [].concat(payments.Payments) // копируем массив платежей
    sortPays.sort((a, b) => a.Id < b.Id)          // сортируем массив платежей по ID

    var Pays = <Spinner />
    
    if (!payments.isLoad) {
      if (sortPays.length == 0) {
        Pays = <Grid><Col><Row style={[main.jC_C, main.fD_R]}><Text style={main.clGrey}>В этом месяце ещё нет платежей</Text></Row></Col></Grid>
      } else {
        Pays = <ListPays sortPayments={sortPays} GoToEdit={this._navigateToEdit} />
      }
    }

    return (
        <Container>

          <Segment style={main.bgWhite}>
            <Left>
              <Button transparent onPress={this._prevMonth} style={[styles.prevMonthBtn, main.clGrey]}>
                <FontAwesome name="angle-left" size={27} />
              </Button>
            </Left>
            <H3 style={[{ marginTop:11, marginRight:5 }, main.clGrey]} button onPress={this._showModalCalendar}>
              {capitalize(moment(this.state.selectedDate).format("MMMM YYYY"))}
            </H3>
            <FontAwesome style={[{ marginTop:8 }, main.clGrey]} name="sort-down" size={20} button onPress={this._showModalCalendar} />
            <Right>
              <Button transparent style={[styles.nextMonthBtn, main.clGrey]} onPress={this._nextMonth}>
                <FontAwesome name="angle-right" size={27} />
              </Button>
            </Right>
          </Segment>

          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._refreshData}
              />
            }
          >
            <Card transparent>
              <CardItem>
                <Grid>
                  <Row>
                    <Col>
                      <Row style={[main.jC_C, main.aI_C]}>
                        <Button disabled={(payments.isLoad)} success={(!payments.isLoad)} rounded onPress={this._navigateToIncome}>
                          <Icon ios="ios-add" android="md-add"/>
                          <Text>Доход</Text>
                        </Button>
                      </Row>
                    </Col>
                    <Col>
                      <Row style={[main.jC_C, main.aI_C]}>
                        <Button disabled={(payments.isLoad)} danger={(!payments.isLoad)} rounded onPress={this._navigateToExpense}>
                          <Text>Расход</Text>
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

          <Modal animationType="fade"
            transparent={true}
            visible={this.state.visibleCalendar}
            onRequestClose={this._hideModalCalendar}
          >
            <View style={main.modalOverlay} />
            <View style={main.modalCalendar}>
              <MonthSelectorCalendar 
                localeLanguage='ru'
                localeSettings={moment.locale('ru')}
                swipable={true}
                selectedDate={this.state.selectedDate}
                onMonthTapped={this._changeMonth}
                selectedMonthTextStyle={main.clWhite}
                selectedBackgroundColor='#5D90B7'
                maxDate={moment(this.state.selectedDate).add(10, 'year')}
                nextIcon={<FontAwesome name="arrow-right" size={19} style={styles.calendarRightBtn}/>}
                prevIcon={<FontAwesome name="arrow-left" size={19} style={styles.calendarLeftBtn}/>}
                yearTextStyle={styles.modalCalendarText}
                monthTextStyle={styles.modalCalendarText}
              />

              <Button block info onPress={this._hideModalCalendar}>
                <Text>Закрыть</Text>
              </Button>
          </View>
        </Modal>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  modalCalendarText: {
    fontFamily:'Roboto',
    fontSize:16
  },
  calendarLeftBtn: {
    marginLeft:15, 
    color:'#5D90B7'
  },
  calendarRightBtn: {
    marginRight:15, 
    color:'#5D90B7'
  },
  prevMonthBtn: {
    marginRight:'auto', 
    marginLeft:0, 
    paddingLeft:25, 
    paddingRight:10,
  },
  nextMonthBtn: {
    marginLeft:'auto',
    marginRight:0,
    paddingLeft:10,
    paddingRight:25,
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)