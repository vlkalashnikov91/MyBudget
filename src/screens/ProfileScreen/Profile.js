import React, {Component} from 'react'
import { Alert } from 'react-native'
import { Container, Body, Content, Item, Button, Text, Icon, Card, CardItem, Picker, Label, Right, Header, Title } from 'native-base'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { UserAuth } from '../../actions/UserActions'
import { styles as main } from '../../Style'
import { ToastTr } from '../../components/Toast'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      DefCurrency: this.props.user.DefCurrency,
      CarryOverRests: this.props.user.CarryOverRests,
      UseTemplates: this.props.user.UseTemplates,
      isChange: true,
    }

    this._saveSettings = this._saveSettings.bind(this)
    this._balanceTransfer = this._balanceTransfer.bind(this)
    this._changeCurrency = this._changeCurrency.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isChange === false) {
      if(nextProps.user.Error.length > 0) {
        ToastTr.Danger(nextProps.user.Error)
      } else if (nextProps.user.UserId.length > 0) {
        ToastTr.Success('Изменено')
      }
      this.setState({ isChange: true })
    }
  }

  _changeCurrency(value) {
    this.setState({ DefCurrency: value, isChange: false })
  }

  _balanceTransfer(value) {
    this.setState({ CarryOverRests: value, isChange: false })
  }

  setModalVisible = () => {
    Alert.alert(
      'Перенос остатка',
      'Если у Вас остались средства на балансе за прошлый месяц, они появятся как доход в новом месяце',
      [
        {text: 'OK'},
      ]
    )
  }

  logout = () => {
    this.props.gotologout()
    this.props.navigation.navigate('Login')
  }

  _goto(where){
    this.props.navigation.navigate(where)
  }

  _saveSettings() {
    let st = this.state
    this.props.changesettings(this.props.user.UserId, st.DefCurrency, st.CarryOverRests, st.UseTemplates)
  }

  render() {
    return (
        <Container>
          <Header>
            <Body>
              <Title style={main.ml_15}>Мой кабинет</Title>
            </Body>
          </Header>
          <Content padder>
            <Card>
              <CardItem bordered>
                <Text style={[main.clIvan, main.fontFamBold]}>Параметры учетной записи</Text>
              </CardItem>

              <CardItem bordered button onPress={_=>this._goto('ChangePassword')}>
                <Body>
                  <Text style={main.clGrey}>Изменить пароль</Text>
                </Body>
                <Right>
                  <FontAwesome name="angle-right" size={20}/>
                </Right>
              </CardItem>
            </Card>

            <Card>
              <CardItem bordered>
                <Text style={[main.clIvan, main.fontFamBold]}>Персональные настройки</Text>
              </CardItem>
              <CardItem bordered button onPress={_=>this._goto('Category')}>
                <Body>
                  <Text style={main.clGrey}>Мои категории</Text>
                </Body>
                <Right>
                  <FontAwesome name="angle-right" size={20}/>
                </Right>
              </CardItem>
              <CardItem bordered button onPress={_=>this._goto('MonthlyPays')}>
                <Body>
                  <Text style={main.clGrey}>Ежемесячные платежи</Text>
                </Body>
                <Right>
                  <FontAwesome name="angle-right" size={20}/>
                </Right>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Item>
                    <Label>Валюта по умолчанию</Label>
                    <Picker mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.DefCurrency}
                      onValueChange={this._changeCurrency}
                    >
                      <Picker.Item label="₸" value="₸" />
                      <Picker.Item label="$" value="$" />
                      <Picker.Item label="€" value="€" />
                    </Picker>
                  </Item>

                  <Item>
                    <Label>Перенос остатка</Label>
                    <Icon name='ios-information-circle' style={main.clGrey} button onPress={this.setModalVisible} />
                    <Picker mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.CarryOverRests}
                      onValueChange={this._balanceTransfer}
                    >
                      <Picker.Item label="Да" value={true} />
                      <Picker.Item label="Нет" value={false} />
                    </Picker>
                  </Item>
                </Body>
              </CardItem>
              
              <CardItem>
                <Button onPress={this._saveSettings} disabled={this.state.isChange} style={(this.state.isChange)?{}:main.bgIvan}>
                  <Text>Сохранить изменения</Text>
                </Button>
              </CardItem>
            </Card>

            <Card>
              <CardItem button onPress={_=>this._goto('About')}> 
                <Text>О приложении</Text>
              </CardItem>
            </Card>

            <Button block danger onPress={this.logout} style={main.mt_20} iconLeft>
              <Icon ios="ios-exit" android="md-exit" />
              <Text>Выход</Text>
            </Button>
          </Content>
        </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changesettings: (UserId, DefCurrency, UseTemplates, CarryOverRests) => {
        dispatch(UserAuth.ChangeSettings(UserId, DefCurrency, UseTemplates, CarryOverRests))
    },
    gotologout: () => {
      dispatch(UserAuth.Logout())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)