import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, DatePicker, H3, Picker, Grid, Form, View } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE } from '../../constants/Payment'
import { SummMask, ClearNums } from '../../utils/utils'


class EditPayment extends Component {
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
    this._editPayment = this._editPayment.bind(this)
    this._getCategoryList = this._getCategoryList.bind(this)
  }

  componentDidMount() {
    nav = this.props.navigation
    payments = this.props.payments.Payments

    if (nav.getParam('itemid', -1) !== -1 ) {
      let item = payments.find(el => el.Id === nav.getParam('itemid'))
      
      if (item !== undefined) {
        this.setState({ Id: item.Id, CategoryId: item.CategoryId, Amount: item.Amount.toString(), Name: item.Name, TransDate: item.TransDate, IsSpending: item.IsSpending })
      }
    }
  } 

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if(nextProps.payments.Error.length === 0) {
      ToastTr.Success('Платеж изменен')
    }
    this.props.navigation.goBack()
  }

  _getCategoryList() {
    const income = this.props.categories.Income
    const expense = this.props.categories.Expense

    /*Если было выбрано "Редактировать" - то нужно определить к какой категории относится платеж и сформировать список*/
    let CatDesc = income.find(el => el.Id === this.state.CategoryId)

    if (CatDesc == undefined) {
      return expense
    } else {
      return income
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

  _editPayment() {
    st = this.state

    if (this._checkParams()) {
      this.setState({ Loading: true })

      this.props.editpayment(st.Id, st.CategoryId, Number(st.Amount), st.Name, st.TransDate, st.IsSpendingCategory)
    }
  }

  render() {
    const { user } = this.props
    const { Amount, errAmount, CategoryId, Name, TransDate, Loading } = this.state

    return <Container>
            <Content padder>
              <Card>
                <CardItem>
                  <Body>
                    <Form style={{alignSelf: 'stretch'}}>

                      <Grid style={main.width_90prc}>
                        <Item stackedLabel style={{width:'80%'}} error={errAmount}>
                          <Label style={main.fontFam}>Сумма</Label>
                          <Input style={[main.clGrey, main.fontFam]} onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
                        </Item>
                        <H3 style={[main.clGrey, {position:'absolute', right:0, bottom:15}]}>{user.DefCurrency}</H3>
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

                      <Item stackedLabel style={[main.mb_20, main.mt_20]}>
                        <Label style={main.fontFam}>Описание</Label>
                        <Input
                          onChangeText={this._changeDesc}
                          value={Name}
                          style={[main.clGrey, main.fontFam]}
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
                        placeHolderTextStyle={[main.clGrey, main.fontFam, main.txtAl_c, {fontSize:20}]}
                        textStyle={[main.clGrey, main.fontFam, main.txtAl_c, {fontSize:20}]}
                        onDateChange={this._changeDate}
                        disabled={false}
                      >
                        <Text>moment(TransDate).format('DD.MM.YYYY')</Text>
                      </DatePicker>
                    </Form>
                  </Body>
                </CardItem>
              </Card>

              <Card transparent>
                <CardItem>
                  <Body>
                    <Button style={main.bgGreen} block onPress={this._editPayment}>
                    {(Loading)
                      ? <Text style={main.fontFam}>Загрузка...</Text>
                      : <Text style={main.fontFam}>Сохранить</Text>
                    }
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>

            <ModalLoading isActive={Loading} color={ivanColor} />
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
    editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpendingCategory) => {
      dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpendingCategory))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditPayment)
