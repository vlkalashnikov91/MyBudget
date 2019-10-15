import React, {Component} from 'react'
import { Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Grid, Row, Form, ListItem, CheckBox, Left, Header, Title } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import { TargetActions } from '../../actions/TargetActions'
import ModalLoading from '../../components/ModalLoading'
import { SummMask, ClearSpace, onlyNumbers } from '../../utils/utils'


class EditItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      GoalName: '',
      Type: '',
      Amount: '',
      CurAmount: '',
      CompleteDate: null,
      IsActive: false,
      errGoalName: false,
      errAmount: false,
      errCurAmount: false,
      Loading: false,
      isShowEndDate: false,
    }

    this._saveItem = this._saveItem.bind(this)
    this._checkParams = this._checkParams.bind(this)
    this.toggleEndDate = this.toggleEndDate.bind(this)

  }

  componentDidMount() {
    nav = this.props.navigation
    targets = this.props.targets.Targets

    if (nav.getParam('itemid', -1) !== -1) {
      let item = this.props.targets.Targets.find(el => el.Id === nav.getParam('itemid'))

      if (item != undefined) {
        let isShow = ((item.CompleteDate===null)||(item.CompleteDate===undefined))? false: true
        this.setState({
          Id: item.Id, 
          GoalName: item.GoalName, 
          Amount: item.Amount.toString(), 
          CurAmount: item.CurAmount.toString(), 
          Type: item.Type, 
          CompleteDate: new Date(item.CompleteDate), 
          isShowEndDate: isShow,
          IsActive: item.IsActive
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loading: false })

    if (nextProps.targets.Error.length == 0) {
      ToastTr.Success('Изменено')
    }

    this.props.navigation.goBack()
  }

  _changeName = value => {
    this.setState({ GoalName: value })
  }

  toggleEndDate() {
    this.setState(prevState => ({isShowEndDate: !prevState.isShowEndDate, CompleteDate: null}))
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

  _changeCurAmount = value => {
    var val = ClearSpace(value)

    if (val.length === 0) {
      this.setState({ CurAmount: '' })
    } else {
      if (onlyNumbers(val)) {
        this.setState({ CurAmount: String(Number(val)) })
      }
    }
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
    if ((st.CurAmount.length == 0) || Number(st.CurAmount < 0)) {
      this.setState({ errCurAmount: true })
      return false
    }

    if (Number(st.Amount) < Number(st.CurAmount)) {
      ToastTr.Default('Сумма пополнения не может быть больше общей суммы')
      return false
    }

    return true
  }

  _saveItem() {
    let st = this.state
    let UserId = this.props.user.UserId
    let date = (st.CompleteDate) ? moment(st.CompleteDate).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS) : null

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.edititem(UserId, st.Id, st.GoalName, st.Type, Number(st.Amount), Number(st.CurAmount), date)
    }
  }

  _setModalVisible() {
    Alert.alert(
      null,
      'За неделю до окончания этой даты на главном экране появится подсказка.',
      [
        {text: 'Ясно'},
      ]
    )
  }

  render() {
      const { user, navigation } = this.props
      const { GoalName, Amount, CurAmount, CompleteDate, IsActive, errGoalName, errAmount, errCurAmount, Loading, isShowEndDate } = this.state

      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=>navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Редактировать</Title>
            </Body>
          </Header>
          <Content padder>
            <Form style={styles.formStyle}>

              <Item stackedLabel error={errGoalName}>
                <Label style={main.fontFam}>Наименование <Text style={main.clOrange}>*</Text></Label>
                <Input onChangeText={this._changeName} value={GoalName} />
              </Item>

              <Grid style={main.width_90prc}>
                <Item stackedLabel style={{width:'80%'}} error={errAmount}>
                  <Label style={main.fontFam}>Полная сумма <Text style={main.clOrange}>*</Text></Label>
                  <Input onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
                </Item>
                <H3 style={styles.currIcon}>{user.DefCurrency}</H3>
              </Grid>

              <Grid style={main.width_90prc}>
                <Item stackedLabel style={{width:'80%'}} error={errCurAmount}>
                  <Label style={main.fontFam}>Текущая сумма</Label>
                  <Input onChangeText={this._changeCurAmount} value={SummMask(CurAmount)} maxLength={10} keyboardType="number-pad"/>
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
                    placeHolderText={(CompleteDate) ? moment(CompleteDate).add(1, 'day').format('DD.MM.YYYY') : "дд.мм.гггг"}
                    textStyle={styles.dateTextStyle}
                    placeHolderTextStyle={styles.dateTextStyle}
                    onDateChange={this._changeDate}
                    disabled={false}
                  >
                    <Text>moment(TransDate).add(1, 'day').format('DD.MM.YYYY')</Text>
                  </DatePicker>

                  <AntDesign name="questioncircle" button onPress={this._setModalVisible} style={[main.ml_15, main.clBlue]} size={20} />

                </Row>
              </Grid>
              }
            </Form>
            
            <Card transparent>
              <CardItem>
                <Body>
                  <Button style={(IsActive)?main.bgGreen:{}} block disabled={(!IsActive)} onPress={this._saveItem}>
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
    edititem:(UserId, Id, GoalName, Type, Amount, CurAmount, CompleteDate) => {
      dispatch(TargetActions.Edit(UserId, Id, GoalName, Type, Amount, CurAmount, CompleteDate))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem)