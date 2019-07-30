import React, {Component} from 'react'
import { Alert } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Grid, Row, Form } from 'native-base'

import { styles as main } from '../../Style'
import { ToastTr } from '../../components/Toast'
import { TargetActions } from '../../actions/TargetActions'
import { TARGET, OWEME, IDEBT } from '../../constants/TargetDebts'
import ModalLoading from '../../components/ModalLoading'
import { SummMask, ClearNums } from '../../utils/utils'


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
      //CompleteDate: undefined,
      CompleteDate: null, //временно
      errGoalName: false,
      errAmount: false,
      Loading: false,
    }

    this._saveItem = this._saveItem.bind(this)
    this._checkParams = this._checkParams.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let type = navigation.getParam('type', TARGET) /* target - в случае если тип будет не определен */
    return {
      title: headerText(type)
    }
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
    this.setState({ Amount: ClearNums(value) })
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

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.additem(UserId, st.GoalName, type, Number(st.Amount), Number(st.CurAmount), st.CompleteDate)    
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
      const { GoalName, Amount, CompleteDate, errGoalName, errAmount, Loading } = this.state

      return (
        <Container>
          <Content padder>
            <Card >
              <CardItem >
                <Body>
                  <Form style={{alignSelf: 'stretch'}}>

                    <Item floatingLabel error={errGoalName} style={{marginTop:0}}>
                      <Label style={main.fontFam}>Наименование</Label>
                      <Input onChangeText={this._changeName} value={GoalName} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                    </Item>

                    <Grid style={main.width_90prc}>
                      <Item floatingLabel style={{width:'80%'}} error={errAmount}>
                        <Label style={main.fontFam}>Полная сумма</Label>
                        <Input style={[main.clGrey, main.fontFam, main.mt_5]} onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
                      </Item>
                      <H3 style={[main.clGrey, {position:'absolute', right:0, bottom:5}]}>{user.DefCurrency}</H3>
                    </Grid>

                  {/* временно
                  <CardItem>
                    <Body>
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
                            placeHolderText={(CompleteDate) ? moment(CompleteDate).format('DD.MM.YYYY') : "Дата окончания"}
                            textStyle={main.clGrey}
                            placeHolderTextStyle={main.clGrey}
                            onDateChange={this._changeDate}
                            disabled={false}
                          />
                          <Icon name='ios-information-circle' style={[main.clGrey, main.ml_20]} button onPress={this._setModalVisible} />
                        </Row>
                      </Grid>
                    </Body>
                  </CardItem>
                  */}
                  </Form>
                </Body>
              </CardItem>
            </Card>
            
            <Card transparent>
              <CardItem>
                <Body>
                  <Button style={main.bgGreen} block onPress={this._saveItem}>
                  {(Loading)
                    ? <Text style={main.fontFam}>Загрузка</Text>
                    : <Text style={main.fontFam}>Создать</Text>
                  }
                  </Button>
                </Body>
              </CardItem>
            </Card>
          </Content>

          <ModalLoading isActive={Loading}/>

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddItem)