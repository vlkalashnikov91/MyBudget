import React, {Component} from 'react'
import { Alert, StyleSheet, Modal, RefreshControl, Image } from 'react-native'
import { connect } from 'react-redux'
import { Container, Content, Button, Text, Icon, Card, CardItem, H2, Segment, Left, Right } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { FontAwesome } from '@expo/vector-icons'
import moment from 'moment'
import 'moment/locale/ru'

import { SkypeIndicator } from 'react-native-indicators'
import { ToastTr } from '../../components/Toast'
import ListPays from '../../components/ListPays'
import BalanceInfo from '../../components/BalanceInfo'
import YearMonthPicker from '../../components/YearMonthPicker'

import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE } from '../../constants/Payment'

import { styles as main, ivanColor } from '../../Style'
import { capitalize } from '../../utils/utils'

class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.timer = null

    this.state = {
      selectedDate: moment(),
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

    this.timer = setTimeout(() => { this._refreshData() }, 200)
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
    const { payments, categories } = this.props
    const isLoad = payments.isLoad || categories.isLoad

    var Pays = <SkypeIndicator color={ivanColor} />
    
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
              <Button transparent onPress={this._prevMonth} style={styles.prevMonthBtn}>
                <FontAwesome name="angle-left" size={27} />
              </Button>
            </Left>
            <H2 style={styles.monthHeader} button onPress={this._showModalCalendar}>
              {capitalize(moment(this.state.selectedDate).format("MMMM YYYY"))}
            </H2>
            <Right>
              <Button transparent style={styles.nextMonthBtn} onPress={this._nextMonth}>
                <FontAwesome name="angle-right" size={27} />
              </Button>
            </Right>
          </Segment>

          <Content
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
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

          <YearMonthPicker ref={(picker) => this.picker=picker} />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  monthHeader: {
    marginTop: 11,
    ...main.clGrey,
    ...main.fontFam
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