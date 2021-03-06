import React, {Component} from 'react'
import { Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Grid, Row, Form, ListItem, CheckBox, Header, Left, Title } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

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

    this.inputs = {}

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
    /*
    let day = value.getDate()
    let month = value.getMonth()+1
    let year = value.getFullYear()
    let data = moment(year+'-'+month+'-'+day).format('YYYY-MM-DDTHH:mm:ss')
    this.setState({ CompleteDate: data })
    */
    this.setState({ CompleteDate: moment(value).format('YYYY-MM-DDTHH:mm:ss') })

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

      const dtFrmt = moment(CompleteDate, 'YYYY-MM-DDTHH:mm:ss').format('DD.MM.YYYY')

      
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
            <Form style={styles.formStyle}>

              <Item floatingLabel error={errGoalName} style={main.mt_0}>
                <Label style={main.fontFam}>Наименование <Text style={main.clOrange}>*</Text></Label>
                <Input style={main.mt_5}
                  value={GoalName}
                  onChangeText={this._changeName}
                  returnKeyType={'next'}
                  autoFocus={true}
                  blurOnSubmit={false} 
                  getRef={input => { this.inputs[1] = input }}
                  onSubmitEditing={_=> this.inputs[2]._root.focus()}
                />
              </Item>

              <Grid style={[main.width_90prc, main.mb_20]}>
                <Item floatingLabel style={{width:'80%'}} error={errAmount}>
                  <Label style={main.fontFam}>Полная сумма <Text style={main.clOrange}>*</Text></Label>
                  <Input style={main.mt_5}
                    onChangeText={this._changeAmount}
                    value={SummMask(Amount)}
                    maxLength={10}
                    keyboardType="number-pad"
                    getRef={input => { this.inputs[2] = input }}
                  />
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
                    locale="ru"
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode="calendar"
                    placeHolderText={(CompleteDate) ? dtFrmt : "дд.мм.гггг"}
                    textStyle={styles.dateTextStyle}
                    placeHolderTextStyle={styles.dateTextStyle}
                    onDateChange={this._changeDate}
                    disabled={false}
                  />
                  <AntDesign name="questioncircle" button onPress={this._setModalVisible} style={[main.ml_15, main.clBlue]} size={20} />
                </Row>
              </Grid>
              }
            </Form>
            
            <Card transparent>
              <CardItem>
                <Body>
                  <Button success block onPress={this._saveItem}>
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
  formStyle: {
    alignSelf: 'stretch', 
    paddingHorizontal:20
  },
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