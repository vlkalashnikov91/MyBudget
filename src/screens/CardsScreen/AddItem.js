import React, {Component} from 'react'
import { Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Grid, Row, Form, ListItem, CheckBox, Header, Left, Title } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import { TargetActions } from '../../actions/TargetActions'
import { TARGET, OWEME, IDEBT } from '../../constants/TargetDebts'
import ModalLoading from '../../components/ModalLoading'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'


const headerText = (type) => {
  switch(type) {
    case TARGET:
      return 'Добавить цель'
    case OWEME:
      return 'Дать в долг'
    case IDEBT:
      return 'Взять в долг'
    default:
      return 'ERROR'
  }
}

class AddItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      GoalName: '',
      Type: '',
      Amount: '',
      CurAmount: '0',
      CompleteDate: null,
      errGoalName: false,
      errAmount: false,
      Loading: false,
      isShowEndDate: false,
    }

    this._saveItem = this._saveItem.bind(this)
    this._checkParams = this._checkParams.bind(this)
    this.toggleEndDate = this.toggleEndDate.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if (nextProps.targets.Error.length === 0) {
      ToastTr.Success('Добавлено')
    }

    this.props.navigation.goBack()
  }

  _changeName = value => {
    this.setState({ GoalName: value })
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

  toggleEndDate() {
    this.setState(prevState => ({isShowEndDate: !prevState.isShowEndDate, CompleteDate: undefined}))
  }

  _changeDate = value => {
    this.setState({ CompleteDate: value })
  }

  _checkParams() {
    st = this.state

    if (st.GoalName.length == 0) {
      this.setState({ errGoalName: true })
      return false
    }
    if ((st.Amount.length == 0) || Number(st.Amount <= 0)) {
      this.setState({ errAmount: true })
      return false
    }

    return true
  }

  _saveItem() {
    let st = this.state
    let UserId = this.props.user.UserId
    let type = this.props.navigation.getParam('type', TARGET)
    let date = (st.CompleteDate) ? moment(st.CompleteDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) : null

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.additem(UserId, st.GoalName, type, Number(st.Amount), Number(st.CurAmount), date)    
    }
  }

  _setModalVisible() {
    Alert.alert(
      null,
      'За месяц до окончания этой даты на главном экране появится подсказка.',
      [
        {text: 'Ясно'},
      ]
    )
  }

  render() {
      const { user, navigation } = this.props
      const { GoalName, Amount, CompleteDate, errGoalName, errAmount, Loading, isShowEndDate } = this.state
      let type = navigation.getParam('type', TARGET) /* target - в случае если тип будет не определен */
      
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=>navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>{headerText(type)}</Title>
            </Body>
          </Header>
          <Content padder>
            <Form style={{alignSelf: 'stretch', paddingHorizontal:20}}>

              <Item floatingLabel error={errGoalName} style={main.mt_0}>
                <Label style={main.fontFam}>Наименование <Text style={main.clOrange}>*</Text></Label>
                <Input onChangeText={this._changeName} value={GoalName} style={main.mt_5}/>
              </Item>

              <Grid style={[main.width_90prc, main.mb_20]}>
                <Item floatingLabel style={{width:'80%'}} error={errAmount}>
                  <Label style={main.fontFam}>Полная сумма <Text style={main.clOrange}>*</Text></Label>
                  <Input style={main.mt_5} onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
                </Item>
                <H3 style={styles.currIcon}>{user.DefCurrency}</H3>
              </Grid>

              <ListItem noBorder>
                <CheckBox checked={isShowEndDate} onPress={this.toggleEndDate} color={ivanColor}/>
                <Body><Text button onPress={this.toggleEndDate} style={{color:'#575757'}}>Дата окончания</Text></Body>
              </ListItem>

              {isShowEndDate &&
              <Grid>
                <Row style={[main.jC_C, main.aI_C]}>
                  <DatePicker
                    formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                    defaultDate={CompleteDate}
                    minimumDate={new Date(2016, 1, 1)}
                    maximumDate={new Date(2040, 12, 31)}
                    locale="ru"
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode="calendar"
                    placeHolderText={(CompleteDate) ? moment(CompleteDate).format('DD.MM.YYYY') : "дд.мм.гггг"}
                    textStyle={styles.dateTextStyle}
                    placeHolderTextStyle={styles.dateTextStyle}
                    onDateChange={this._changeDate}
                    disabled={false}
                  />
                  <Icon name='ios-information-circle' style={[{color:'#609AD3'}, main.ml_20]} button onPress={this._setModalVisible} />
                </Row>
              </Grid>
              }
            </Form>
            
            <Card transparent>
              <CardItem>
                <Body>
                  <Button style={main.bgGreen} block onPress={this._saveItem}>
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
    color:'#395971',
    ...main.txtAl_c,
    fontSize:20
  },
  currIcon: {
    position:'absolute',
    right:5,
    bottom:5
  },
})

const mapStateToProps = state => {
  return {
    user: state.User,
    targets: state.TargetDebts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    additem:(UserId, GoalName, Type, Amount, CurAmount, CompleteDate) => {
        dispatch(TargetActions.Add(UserId, GoalName, Type, Amount, CurAmount, CompleteDate))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItem)