import React, {Component} from 'react'
import { Alert, StyleSheet } from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Icon, H3, DatePicker, Grid, Row, Form, ListItem, CheckBox, Left, Header } from 'native-base'

import { styles as main, ivanColor } from '../../Style'
import { ToastTr } from '../../components/Toast'
import { TargetActions } from '../../actions/TargetActions'
import ModalLoading from '../../components/ModalLoading'
import { SummMask, ClearNums } from '../../utils/utils'


class EditItem extends Component {
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
          isShowEndDate: isShow 
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
    this.setState(prevState => ({isShowEndDate: !prevState.isShowEndDate, CompleteDate: undefined}))
  }

  _changeAmount = value => {
    this.setState({ Amount: String(Number(ClearNums(value))) })
  }

  _changeCurAmount = value => {
    this.setState({ CurAmount: String(Number(ClearNums(value))) })
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

    return true
  }

  _saveItem() {
    let st = this.state
    let UserId = this.props.user.UserId

    if (this._checkParams()) {
      this.setState({ Loading: true })
      this.props.edititem(UserId, st.Id, st.GoalName, st.Type, Number(st.Amount), Number(st.CurAmount), st.CompleteDate)
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
      const { GoalName, Amount, CurAmount, CompleteDate, errGoalName, errAmount, errCurAmount, Loading, isShowEndDate } = this.state

      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=>this.props.navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Редактировать</Title>
            </Body>
          </Header>
          <Content padder>
            <Form style={{alignSelf: 'stretch'}}>

              <Item stackedLabel error={errGoalName}>
                <Label>Наименование</Label>
                <Input onChangeText={this._changeName} value={GoalName} style={main.clGrey}/>
              </Item>

              <Grid style={main.width_90prc}>
                <Item stackedLabel style={{width:'80%'}} error={errAmount}>
                  <Label>Полная сумма</Label>
                  <Input style={main.clGrey} onChangeText={this._changeAmount} value={SummMask(Amount)} maxLength={10} keyboardType="number-pad"/>
                </Item>
                <H3 style={styles.currIcon}>{user.DefCurrency}</H3>
              </Grid>

              <Grid style={main.width_90prc}>
                <Item stackedLabel style={{width:'80%'}} error={errCurAmount}>
                  <Label>Текущая сумма</Label>
                  <Input style={main.clGrey} onChangeText={this._changeCurAmount} value={SummMask(CurAmount)} maxLength={10} keyboardType="number-pad"/>
                </Item>
                <H3 style={styles.currIcon}>{user.DefCurrency}</H3>
              </Grid>

              <ListItem noBorder>
                <CheckBox checked={isShowEndDate} onPress={this.toggleEndDate}/>
                <Body>
                  <Text>Дата окончания</Text>
                </Body>
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
                  >
                    <Text>moment(TransDate).format('DD.MM.YYYY')</Text>
                  </DatePicker>

                  <Icon name='ios-information-circle' style={[main.clGrey, main.ml_20]} button onPress={this._setModalVisible} />
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
  dateTextStyle: {
    ...main.clGrey,
    ...main.txtAl_c,
    fontSize:20
  },
  currIcon: {
    ...main.clGrey,
    position:'absolute',
    right:0,
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