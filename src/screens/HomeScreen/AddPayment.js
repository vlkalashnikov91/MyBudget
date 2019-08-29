import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, DatePicker, H3, Picker, Grid, Form, Header, Left, Title } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE } from '../../constants/Payment'
import { SummMask, ClearNums } from '../../utils/utils'

const headerText = (type) => {
  switch(type) {
    case INCOME:
      return 'Добавить доход'
    case EXPENSE:
      return 'Добавить расход'
    default:
      return 'ERROR'
  }
}


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

  _changeDesc = value => {
    this.setState({ Name: value })
  }

  _changeCat = value => {
    this.setState({ CategoryId: value })
  }

  _changeAmount = value => {
    this.setState({ Amount: String(Number(ClearNums(value))) })
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

  render() {
    const { user } = this.props
    const { Amount, errAmount, CategoryId, Name, TransDate, Loading } = this.state
    let type = this.props.navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> this.props.navigation.goBack()}>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title>{headerText(type)}</Title>
          </Body>
        </Header>
        <Content padder>
          <Form style={{alignSelf: 'stretch'}}>

            <Grid style={main.width_90prc}>
              <Item floatingLabel style={[{width:'80%'}, main.mt_0]} error={errAmount}>
                <Label>Сумма</Label>
                <Input
                  onChangeText={this._changeAmount}
                  value={SummMask(Amount)}
                  keyboardType="number-pad"
                  style={[main.clGrey, main.mt_5]} 
                  maxLength={10}
                />
              </Item>
              <H3 style={styles.currencyIcon}>{user.DefCurrency}</H3>
            </Grid>

            <Grid style={[main.fD_R, main.aI_C, main.mt_20, {paddingLeft:15}]}>
              <Item picker>
                <Picker mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={CategoryId}
                  onValueChange={this._changeCat}
                >
                {
                  this._getCategoryList().map(value => <Picker.Item label={value.Name} value={value.Id} key={value.Id} /> )
                }
                </Picker>
              </Item>
            </Grid>

            <Item floatingLabel style={main.mb_20}>
              <Label>Описание</Label>
              <Input
                onChangeText={this._changeDesc}
                value={Name}
                style={[main.clGrey, main.mt_5]}
                multiline={true}
              />
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
  dateTextStyle: {
    ...main.clGrey,
    ...main.txtAl_c,
    fontSize:20
  },
  currencyIcon: {
    ...main.clGrey,
    position:'absolute',
    right:0,
    bottom:5
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
