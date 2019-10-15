import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, DatePicker, H3, Picker, Grid, Form, Header, Left, Title } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

import { styles as main, ivanColor, ivanGray } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE, headerText } from '../../constants/Payment'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'

class AddPayment extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Id: -1, 
      CategoryId: (this.props.navigation.getParam('type', INCOME) === INCOME) ? 1 : 2,
      Amount: '',
      Name:'', 
      TransDate: new Date(),
      IsSpending: (this.props.navigation.getParam('type', INCOME) === INCOME) ? false : true,
      IsPlaned: false,
      Loading: false,
      errAmount: false
    } 

    this._addNewCat = this._addNewCat.bind(this)
    this._checkParams = this._checkParams.bind(this)
    this._addPayment = this._addPayment.bind(this)
    this._getCategoryList = this._getCategoryList.bind(this)
    this._gotoCategories = this._gotoCategories.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if(nextProps.payments.Error.length === 0) {
      ToastTr.Success('Платеж создан')
    }
    this.props.navigation.goBack()
  }

  _getCategoryList() {
    const type = this.props.navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */
    const income = this.props.categories.Income
    const expense = this.props.categories.Expense

    if (type === INCOME) {
        return income
    } else if (type === EXPENSE) {
        return expense
    }
  }

  _changeName = value => {
    this.setState({ Name: value })
  }

  _changeCat = value => {
    this.setState({ CategoryId: value })
  }

  _changeAmount = value => {
    var val = ClearSpace(value)

    if (val.length === 0) {
      this.setState({ Amount: '' })
    } else {
      if (onlyNumbers(val)) {
        this.setState({ Amount: String(Number(val)) })
      }
    }
  }

  _changeDate = value => {
    this.setState({ TransDate: value })
  }

  _addNewCat() {
    this.props.navigation.navigate('Category')
  }

  _checkParams() {
    st = this.state

    if ((st.Amount.length === 0) || (Number(st.Amount) < 0)) {
      this.setState({ errAmount: true })
      return false
    }

    return true
  }

  _addPayment() {
    st = this.state

    if (this._checkParams()) {
      this.setState({ Loading: true })

        this.props.addpayment(st.CategoryId, Number(st.Amount), st.Name, st.TransDate, st.IsSpending, st.IsPlaned, this.props.user.UserId)
    }
  }

  _gotoCategories() {
    this.props.navigation.navigate('Category')
  }

  render() {
    const { user, navigation } = this.props
    const { Amount, errAmount, CategoryId, Name, TransDate, Loading } = this.state
    let type = this.props.navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> navigation.goBack()}>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title>{headerText(type)}</Title>
          </Body>
        </Header>
        <Content padder>
          <Form style={styles.fromStyle}>

            <Grid style={main.width_90prc}>
              <Item floatingLabel style={[{width:'80%'}, main.mt_0]} error={errAmount}>
                <Label style={main.fontFam}>Сумма <Text style={main.clOrange}>*</Text></Label>
                <Input onChangeText={this._changeAmount} value={SummMask(Amount)} keyboardType="number-pad" style={main.mt_5} maxLength={10} />
              </Item>
              <H3 style={styles.currencyIcon}>{user.DefCurrency}</H3>
            </Grid>

            <Grid style={styles.catGrid}>
              <Item picker style={main.width_90prc}>
                <Picker mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={CategoryId}
                  onValueChange={this._changeCat}
                >
                {
                  this._getCategoryList().map(value => <Picker.Item color={ivanColor} label={value.Name} value={value.Id} key={value.Id} /> )
                }
                </Picker>
              </Item>
              <FontAwesome name="pencil" size={20} style={[{color:ivanGray}, main.ml_15]} button onPress={this._gotoCategories} />
            </Grid>

            <Item floatingLabel style={main.mb_20}>
              <Label style={main.fontFam}>Наименование</Label>
              <Input onChangeText={this._changeName} value={Name} style={main.mt_5}/>
            </Item>

            <DatePicker
              formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
              defaultDate={TransDate}
              minimumDate={new Date(2016, 1, 1)}
              maximumDate={new Date(2040, 12, 31)}
              locale="ru"
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode="calendar"
              placeHolderText={(TransDate) ? moment(TransDate).format('DD.MM.YYYY') : "Выберите дату"}
              placeHolderTextStyle={styles.dateTextStyle}
              textStyle={styles.dateTextStyle}
              onDateChange={this._changeDate}
              disabled={false}
            >
              <Text>moment(TransDate).format('DD.MM.YYYY')</Text>
            </DatePicker>
          </Form>

          <Card transparent>
            <CardItem>
              <Body>
                <Button style={main.bgGreen} block onPress={this._addPayment}>
                  {(Loading)
                  ? <Text>Загрузка...</Text>
                  : <Text>Создать</Text>
                  }
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>

        <ModalLoading isActive={Loading} color={ivanColor} />
      </Container>
    )
  }
}

    
const styles = StyleSheet.create({
  fromStyle:{
    alignSelf: 'stretch',
    paddingHorizontal:10
  },
  dateTextStyle: {
    ...main.clGrey,
    ...main.txtAl_c,
    fontSize:20
  },
  currencyIcon: {
    position:'absolute',
    right:5,
    bottom:5
  },
  catGrid:{
    ...main.fD_R, 
    ...main.aI_C, 
    ...main.mt_20,
    paddingLeft:15
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
    addpayment: (CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned, UserId) => {
      dispatch(PaymentActions.Add(CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned, UserId))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPayment)
