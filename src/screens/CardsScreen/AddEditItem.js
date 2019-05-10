import React, {Component} from 'react'
import { Alert } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Spinner, Grid, Row } from 'native-base'

import { styles as main } from '../../Style'
import { ToastTr } from '../../components/Toast'
import { TargetActions } from '../../actions/TargetActions'
import { TARGET, OWEME, IDEBT, EDIT } from '../../constants/TargetDebts'

const headerText = (type) => {
  switch(type) {
    case TARGET:
      return 'Добавить цель'
    case OWEME:
      return 'Дать в долг'
    case IDEBT:
      return 'Взять в долг'
    case EDIT:
      return 'Редактировать'
    default:
      return 'ERROR'
  }
}

class AddEditItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      GoalName: '',
      Type: '',
      Amount: '',
      CurAmount: '',
      CompleteDate: undefined,
      errGoalName: false,
      errAmount: false,
      errCurAmount: false,
      Loading: false,
    }

    this._saveItem = this._saveItem.bind(this)
    this._checkParams = this._checkParams.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let type = navigation.getParam('type', TARGET) /* target - в случае если тип будет не определен */
    return {
      title: headerText(type),
      headerStyle: main.bgIvan,
      headerTitleStyle: main.clWhite,
      headerTintColor: 'white'
    }
  }

  componentDidMount() {
    nav = this.props.navigation
    targets = this.props.targets.Targets

    if ((nav.getParam('type', TARGET) === EDIT) && (nav.getParam('itemid', -1) !== -1)) {
      let item = this.props.targets.Targets.find(el => el.Id === nav.getParam('itemid'))

      if (item != undefined) {
        this.setState({Id: item.Id, GoalName: item.GoalName, Amount: item.Amount, CurAmount: item.CurAmount, Type: item.Type, CompleteDate: item.CompleteDate })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })
    let txt = this.props.navigation.getParam('type', 1) == 1 ? 'Добавлено' : 'Изменено'

    if (nextProps.targets.Error.length == 0) {
      ToastTr.Success(txt)
    }

    this.props.navigation.goBack()
  }

  _changeName = value => {
      this.setState({ GoalName: value })
  }

  _changeAmount = value => {
    this.setState({ Amount: Number(value) })
  }

  _changeCurAmount = value => {
    this.setState({ CurAmount: Number(value) })
  }

  _changeDate = value => {
    this.setState({ CompleteDate: value })
  }

  _checkParams() {
    st = this.state

    if (st.Amount.length == 0) {
      this.setState({ errAmount: true })
      return false
    }
    if (st.GoalName.length == 0) {
      this.setState({ errGoalName: true })
      return false
    }
    if (st.CurAmount.length == 0) {
      this.setState({ errCurAmount: true })
      return false
    }
    return true
  }

  _saveItem() {
    let st = this.state
    let UserId = this.props.user.UserId
    let type = this.props.navigation.getParam('type', TARGET)

    if (this._checkParams()) {
      this.setState({ Loading: true })

      if (type === EDIT) {
        this.props.edititem(UserId, st.Id, st.GoalName, st.Type, st.Amount, st.CurAmount, st.CompleteDate)
      } else {
        this.props.additem(UserId, st.GoalName, type, st.Amount, st.CurAmount, st.CompleteDate)    
      }
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
      const { user } = this.props

      return (
        <Container>
          <Content padder>
              <Card>
                  <CardItem>
                      <Body>
                          <Item floatingLabel error={this.state.errGoalName}>
                          <Label>Наименование</Label>
                          <Input onChangeText={this._changeName} value={this.state.GoalName} style={main.clGrey}/>
                          </Item>
                      </Body>
                  </CardItem>
                  <CardItem>
                      <Body style={[main.fD_R, main.aI_C]}>
                          <Item floatingLabel style={{width:'90%'}} error={this.state.errAmount}>
                              <Label>Полная сумма</Label>
                              <Input style={main.clGrey} onChangeText={this._changeAmount} value={this.state.Amount.toString()} keyboardType="number-pad"/>
                          </Item>
                          <H3 style={main.clGrey}>{user.userCurrency}</H3>
                      </Body>
                  </CardItem>
                  <CardItem>
                        <Body style={[main.fD_R, main.aI_C]}>
                          <Item floatingLabel style={{width:'90%'}} error={this.state.errCurAmount}>
                              <Label>Текущая сумма</Label>
                              <Input style={main.clGrey} onChangeText={this._changeCurAmount} value={this.state.CurAmount.toString()} keyboardType="number-pad"/>
                          </Item>
                          <H3 style={main.clGrey}>{user.DefCurrency}</H3>
                      </Body>
                  </CardItem>
                  <CardItem>
                      <Body>
                          <Grid>
                            <Row style={[main.jC_C, main.aI_C]}>
                                <DatePicker
                                    formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                                    defaultDate={this.state.CompleteDate}
                                    minimumDate={new Date(2016, 1, 1)}
                                    maximumDate={new Date(2040, 12, 31)}
                                    locale="ru"
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode="calendar"
                                    placeHolderText={(this.state.CompleteDate) ? moment(this.state.CompleteDate).format('DD.MM.YYYY') : "Дата окончания"}
                                    textStyle={main.clGrey}
                                    placeHolderTextStyle={main.clGrey}
                                    onDateChange={this._changeDate}
                                    disabled={false}
                                />
                                <Icon name='ios-information-circle' style={{color: '#384850', marginLeft:20}} button onPress={this._setModalVisible} />
                            </Row>
                          </Grid>
                      </Body>
                  </CardItem>
              </Card>
              {(this.state.Loading)
              ? <Spinner />
              : <Card transparent>
                  <CardItem>
                      <Body>
                          <Button success block onPress={this._saveItem}>
                              <Text>Сохранить</Text>
                          </Button>
                      </Body>
                  </CardItem>
              </Card>
              }
          </Content>
      </Container>
    )
  }
}

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
    edititem:(UserId, Id, GoalName, Type, Amount, CurAmount, CompleteDate) => {
      dispatch(TargetActions.Edit(UserId, Id, GoalName, Type, Amount, CurAmount, CompleteDate))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditItem)