import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, DatePicker, H3, Picker, Spinner, Form } from 'native-base'

import { styles as main } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE, EDIT } from '../../constants/Payment'

const headerText = (type) => {
  switch(type) {
    case INCOME:
      return 'Добавить доход'
    case EXPENSE:
      return 'Добавить расход'
    case EDIT:
      return 'Редактировать'
    default:
      return 'ERROR'
  }
}


class AddEditPayment extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Id: -1, 
      CategoryId: (this.props.navigation.getParam('type', INCOME) === INCOME) ? 30 : 31,
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
    this._editPayment = this._editPayment.bind(this)
    this._getCategoryList = this._getCategoryList.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let type = navigation.getParam('type', INCOME) /* income - в случае если тип будет не определен */
    return {
      title: headerText(type)
    }
  }

  componentDidMount() {
    nav = this.props.navigation
    payments = this.props.payments.Payments

    if ((nav.getParam('type', INCOME) === EDIT) && (nav.getParam('itemid', -1) !== -1 )) {
      let item = payments.find(el => el.Id === nav.getParam('itemid'))
      
      if (item !== undefined) {
        this.setState({ Id: item.Id, CategoryId: item.CategoryId, Amount: item.Amount.toString(), Name: item.Name, TransDate: item.TransDate, IsSpending: item.IsSpending })
      }
    }
  } 

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    let txt = nextProps.navigation.getParam('type', INCOME) == INCOME ? 'Платеж создан' : 'Платеж изменен'
    
    if(nextProps.payments.Error.length === 0) {
      ToastTr.Success(txt)
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
    } else if (type === EDIT) {
      /*Если было выбрано "Редактировать" - то нужно определить к какой категории относится платеж и сформировать список*/
      let CatDesc = income.find(el => el.Id === this.state.CategoryId)

      if (CatDesc == undefined) {
        return expense
      } else {
        return income
      }
    }
  }

  _changeDesc = value => {
    this.setState({ Name: value })
  }

  _changeCat = value => {
    this.setState({ CategoryId: value })
  }

  _changeAmount = value => {
    this.setState({ Amount: value })
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

  _editPayment() {
    let type = this.props.navigation.getParam('type', INCOME)
    st = this.state

    if (this._checkParams()) {
      this.setState({ Loading: true })

      if (type == EDIT) {
        this.props.editpayment(st.Id, st.CategoryId, st.Amount, st.Name, st.TransDate, st.IsSpendingCategory)
      } else {
        this.props.addpayment(st.CategoryId, st.Amount, st.Name, st.TransDate, st.IsSpending, st.IsPlaned, this.props.user.UserId)
      }
    }
  }

  render() {
    const { user } = this.props
    const { Amount, errAmount, CategoryId, Name, TransDate, Loading } = this.state

    return <Container>
            <Content padder>
              <Card>
                <CardItem>
                  <Body style={[main.fD_R, main.aI_C]}>
                      <Item floatingLabel style={main.width_90prc} error={errAmount}>
                        <Label>Сумма</Label>
                        <Input
                          onChangeText={this._changeAmount}
                          value={Amount}
                          keyboardType="number-pad"
                          style={main.clGrey}
                          maxLength={10}
                        />
                      </Item>
                      <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                  </Body>
                </CardItem>

                <CardItem>
                  <Body style={[main.fD_R, main.aI_C]}>
                    <Item picker style={{width:'85%'}}>
                      <Picker mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
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
                    <Icon name="ios-settings" button style={styles.AddCatButton} onPress={this._addNewCat}/>
                  </Body>
                </CardItem>

                <CardItem>
                  <Body>
                    <Item floatingLabel>
                      <Label>Описание</Label>
                      <Input onChangeText={this._changeDesc} value={Name} style={main.clGrey} multiline={true}/>
                    </Item>
                  </Body>
                </CardItem>

                <CardItem>
                  <Body>
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
                      textStyle={main.clGrey}
                      placeHolderTextStyle={main.clGrey}
                      onDateChange={this._changeDate}
                      disabled={false}
                    />
                  </Body>
                </CardItem>
              </Card>

              <Card transparent>
                <CardItem>
                  <Body>
                    <Button style={main.bgGreen} block onPress={this._editPayment}>
                      <Text>Сохранить</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>

            <ModalLoading isActive={Loading} />
          </Container>
        }
}

    
const styles = StyleSheet.create({
  AddCatButton: {
    ...main.clGrey,
    ...main.ml_10,
    fontSize:35
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
    editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpendingCategory) => {
      dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpendingCategory))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditPayment)
