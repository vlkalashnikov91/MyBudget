import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, Picker, Grid, Form, View, Header, Left, Title } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { TemplatesActions } from '../../actions/TemplatesActions'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'
import { INCOME, EXPENSE } from '../../constants/Payment'

class EditMonthPay extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Id: -1, 
      Name: '',
      CategoryId: -1,
      Amount: '',
      Day: '',
      IsSpending: false,
      Loading: false,
      errAmount: false
    } 

    this._checkParams = this._checkParams.bind(this)
    this._editTemplate = this._editTemplate.bind(this)
    this._getCategoryList = this._getCategoryList.bind(this)
  }

  componentDidMount() {
    nav = this.props.navigation
    templates = this.props.templates.Templates

    if (nav.getParam('itemid', -1) !== -1 ) {
      let item = templates.find(el => el.Id === nav.getParam('itemid'))
      
      if (item !== undefined) {
        this.setState({
            Id: item.Id,
            Name: item.Name,
            CategoryId: item.CategoryId, 
            Amount: item.Amount.toString(), 
            Day: item.Day.toString(), 
            IsSpending: item.IsSpending,
        })
      }
    }
  } 

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if(nextProps.templates.Error.length === 0) {
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

  _changeCat = value => {
    this.setState({ CategoryId: value })
  }

  _changeName = value => {
    this.setState({ Name: value })
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

  _changeDay = value => {
    if (value.length === 0) {
      this.setState({ Day: '' })
    } else {
      if (onlyNumbers(value)) {
        this.setState({ Day: String(Number(value)) })
      }
    }
  }
  
  _checkParams() {
    st = this.state

    if ((st.Amount.length === 0) || (Number(st.Amount) < 0)) {
      this.setState({ errAmount: true })
      return false
    }

    if ((st.Day.length === 0) || (Number(st.Day) < 0) || (Number(st.Day) < 1) || (Number(st.Day) > 31)) {
      this.setState({ errDay: true })
      return false
    }

    return true
  }

  _editTemplate() {
    st = this.state

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.editMonthPay(st.Id, st.Name, Number(st.Amount), Number(st.Day), st.CategoryId, st.IsSpending, this.props.user.UserId)
    }
  }

  render() {
    const { user, navigation } = this.props
    const { Name, Amount, errAmount, CategoryId, Day, errDay, Loading } = this.state

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
          <Form style={{alignSelf: 'stretch'}}>

            <Item stackedLabel style={main.mt_0}>
                <Label>Наименование</Label>
                <Input onChangeText={this._changeName} value={Name} style={main.mt_5}/>
              </Item>
            <Grid style={main.width_90prc}>
              <Item stackedLabel style={[{width:'80%'}, main.mt_0]} error={errAmount}>
                <Label>Сумма</Label>
                <Input onChangeText={this._changeAmount} value={SummMask(Amount)} keyboardType="number-pad" style={main.mt_5} maxLength={10} />
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

            <Item stackedLabel style={[main.mb_20, main.mt_20]} error={errDay}>
              <Label>День платежа</Label>
              <Input onChangeText={this._changeDay} value={Day} keyboardType="number-pad" style={main.clGrey} />
            </Item>
          </Form>

          <Card transparent>
            <CardItem>
              <Body>
                <Button style={main.bgGreen} block onPress={this._editTemplate}>
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
  currencyIcon: {
    position:'absolute',
    right:0,
    bottom:5
  }
})

const mapStateToProps = state => {
  return {
    user: state.User,
    categories: state.Categories,
    templates: state.Templates
  }
}

const mapDispatchToProps = dispatch => {
  return {
    editMonthPay: (Id, Name, Amount, Day, CategoryId, IsSpending, UserId) => {
      dispatch(TemplatesActions.Edit(Id, Name, Amount, Day, CategoryId, IsSpending, UserId))
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditMonthPay)
