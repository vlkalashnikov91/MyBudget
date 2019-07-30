import React, {Component} from 'react'
import { Alert, StyleSheet, Modal, RefreshControl, Image } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Button, Text, Icon, Card, CardItem, H2, View, Spinner, Segment, Left, Right } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import MonthSelectorCalendar from 'react-native-month-selector'
import moment from 'moment'
import 'moment/locale/ru'

import { ToastTr } from '../../components/Toast'
import ListPays from '../../components/ListPays'
import BalanceInfo from '../../components/BalanceInfo'

import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE, EDIT } from '../../constants/Payment'

import { styles as main, ivanColor } from '../../Style'
import { capitalize } from '../../utils/utils'

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
    this._nextMonth = this._nextMonth.bind(this)
    this._prevMonth = this._prevMonth.bind(this)
    this._changeMonth = this._changeMonth.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <BalanceInfo />,
      headerRight: (
        <Icon android='md-information-circle' 
          ios='ios-information-circle' 
          style={[main.clWhite, main.mr_15]} 
          button onPress={navigation.getParam('showModalInfo')}
        />
      ),
      headerLeft: (
        <Image resizeMode='contain' resizeMethod='scale' style={main.imageForHeader} source={require('../../../assets/Logo_min2.png')}></Image>
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

  _navigateToEdit(Id) {
    this.props.navigation.navigate('EditPayment', {itemid: Id})
  }
  
  _navigateToAdd(type) {
    this.props.navigation.navigate('AddPayment', {type: type})
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
    const { payments, categories } = this.props
    const isLoad = payments.isLoad || categories.isLoad

    var Pays = <Spinner />
    
    if (!isLoad) {
      if (payments.Payments.length == 0) {
        Pays = <Grid><Col><Row style={[main.jC_C, main.fD_R]}><Text style={[main.clGrey, main.fontFam]}>В этом месяце ещё нет платежей</Text></Row></Col></Grid>
      } else {
        Pays = <ListPays payments={payments.Payments} GoToEdit={this._navigateToEdit} />
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
            <H2 style={[{ marginTop:11}, main.clGrey, main.fontFam]} button onPress={this._showModalCalendar}>
              {capitalize(moment(this.state.selectedDate).format("MMMM YYYY"))}
            </H2>
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
                        <Button iconLeft disabled={(isLoad)} style={(!isLoad)? main.bgGreen : {}} rounded onPress={_=> this._navigateToAdd(INCOME)}>
                          <Icon ios="ios-add" android="md-add" />
                          <Text style={main.fontFam}>Доход </Text>
                        </Button>
                      </Row>
                    </Col>
                    <Col>
                      <Row style={[main.jC_C, main.aI_C]}>
                        <Button iconRight disabled={(isLoad)} style={(!isLoad)? main.bgDanger : {}} rounded onPress={_=> this._navigateToAdd(EXPENSE)}>
                          <Text style={main.fontFam}>Расход</Text>
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
                selectedDate={this.state.selectedDate}
                onMonthTapped={this._changeMonth}
                selectedMonthTextStyle={main.clWhite}
                selectedBackgroundColor={ivanColor}
                maxDate={moment(this.state.selectedDate).add(10, 'year')}
                nextIcon={<FontAwesome name="arrow-right" size={19} style={[main.mr_15, main.clIvan]} />}
                prevIcon={<FontAwesome name="arrow-left" size={19} style={[main.ml_15, main.clIvan]} />}
                yearTextStyle={styles.modalCalendarText}
                monthTextStyle={styles.modalCalendarText}
              />

              <Button block onPress={this._hideModalCalendar} style={main.bgIvan}>
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
    fontFamily:'SegoeUIRegular',
    fontSize:15
  },
  prevMonthBtn: {
    ...main.mr_auto,
    ...main.ml_0,
    ...main.pdL_25,
    ...main.pdR_10
  },
  nextMonthBtn: {
    ...main.ml_auto,
    ...main.mr_0,
    ...main.pdL_10,
    ...main.pdR_25
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