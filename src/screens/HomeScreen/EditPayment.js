import React, {Component} from 'react'
import { StyleSheet, Alert } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, DatePicker, H3, Picker, Grid, Form, Title, Header, Left } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { PaymentActions } from '../../actions/PaymentActions'
import { INCOME, EXPENSE } from '../../constants/Payment'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'


class EditPayment extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Id: -1, 
      CategoryId: -1,
      Amount: '',
      Name:'', 
      TransDate: undefined,
      IsSpending: false,
      IsPlaned: false,
      Loading: false,
      errAmount: false
    } 

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
        this.setState({ Id: item.Id, 
          CategoryId: item.CategoryId, 
          Amount: item.Amount.toString(), 
          Name: item.Name, 
          TransDate: item.TransDate, 
          IsSpending: item.IsSpending,
          IsPlaned: item.IsPlaned
         })
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
    /*
    let day = value.getDate()
    let month = value.getMonth()+1
    let year = value.getFullYear()
    let data = moment(year+'-'+month+'-'+day).format('YYYY-MM-DDTHH:mm:ss')
    this.setState({ TransDate: data })
    */

    this.setState({ TransDate: moment(value).format('YYYY-MM-DDTHH:mm:ss') })
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
      this.props.editpayment(st.Id, st.CategoryId, Number(st.Amount), st.Name, st.TransDate, st.IsSpending, st.IsPlaned)
    }
  }

  _infoCategories() {
    Alert.alert(
      null,
      'Для настройки списка категорий зайдите в личный кабинет.',
      [
        {text: 'Ясно'},
      ]
    )
  }


  render() {
    const { user, navigation } = this.props
    const { Amount, errAmount, CategoryId, Name, TransDate, Loading } = this.state

    const dtFrmt = moment(TransDate, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={_=> navigation.goBack()}>
              <Icon name='arrow-back'/>
            </Button>
          </Left>
          <Body>
            <Title>Редактировать</Title>
          </Body>
        </Header>
        <Content padder>
          <Form style={styles.fromStyle}>

            <Grid style={main.width_90prc}>
              <Item stackedLabel style={{width:'80%'}} error={errAmount}>
                <Label style={main.fontFam}>Сумма <Text style={main.clOrange}>*</Text></Label>
                <Input onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
              </Item>
              <H3 style={styles.currencyIcon}>{user.DefCurrency}</H3>
            </Grid>

            <Grid style={styles.catGrid}>
              <Item picker style={{flex:0.9}}>
                <Picker mode="dropdown"
                  iosIcon={<Icon name="arrow-down" style={main.clGrey}/>}
                  iosHeader="Категория"
                  headerBackButtonTextStyle={main.clWhite}
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

              <Button icon transparent hitSlop={{top:10, left:10, bottom:10, right:10}} onPress={this._infoCategories} >
                <AntDesign name="questioncircle" size={20} style={main.clBlue}/>
              </Button>

            </Grid>

            <Item stackedLabel style={[main.mb_20, main.mt_20]}>
              <Label style={main.fontFam}>Наименование</Label>
              <Input onChangeText={this._changeName} value={Name}/>
            </Item>

            <DatePicker
              formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
              defaultDate={TransDate}
              locale="ru"
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode="calendar"
              placeHolderText={(TransDate) ? dtFrmt : "Выберите дату"}
              placeHolderTextStyle={styles.dateTextStyle}
              textStyle={styles.dateTextStyle}
              onDateChange={this._changeDate}
              disabled={false}
            >
              <Text>dtFrmt</Text>
            </DatePicker>
            
          </Form>

          <Card transparent>
            <CardItem>
              <Body>
                <Button success block onPress={this._editPayment}>
                {(Loading)
                  ? <Text>Загрузка...</Text>
                  : <Text>Сохранить</Text>
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
    editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => {
      dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditPayment)
