import React, {Component} from 'react'
import { Alert } from 'react-native'
import { Container, Body, Content, Item, Button, Text, Icon, Card, CardItem, Picker, Label, Right } from 'native-base'
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
    this._monthPayment = this._monthPayment.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
      ToastTr.Success('Изменено')
    }
    this.setState({ isChange: true })
  }

  _changeCurrency(value) {
    this.setState({ DefCurrency: value, isChange: false })
  }

  _balanceTransfer(value) {
    this.setState({ CarryOverRests: value, isChange: false })
  }

  _monthPayment(value) {
    this.setState({ UseTemplates: value, isChange: false })
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

  _gotoChangePass = () => {
    this.props.navigation.navigate('ChangePassword')
  }

  _gotoChangeCat = () => {
    this.props.navigation.navigate('Category')
  }

  _gotoAbout = () => {
    this.props.navigation.navigate('About')
  }

  _saveSettings() {
    let st = this.state
    this.props.changesettings(this.props.user.UserId, st.DefCurrency, st.CarryOverRests, st.UseTemplates)
  }

  render() {
    return (
        <Container>
          <Content padder>
            <Card>
              <CardItem bordered>
                <Text style={[main.clIvan, main.fontFamBold]}>Параметры учетной записи</Text>
              </CardItem>

              <CardItem bordered button onPress={this._gotoChangePass}>
                <Body>
                  <Text style={[main.clGrey, main.fontFam]}>Изменить пароль</Text>
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
              <CardItem bordered button onPress={this._gotoChangeCat}>
                <Body>
                  <Text style={[main.clGrey, main.fontFam]}>Мои категории</Text>
                </Body>
                <Right>
                  <FontAwesome name="angle-right" size={20}/>
                </Right>
              </CardItem>
              <CardItem bordered>
                <Body>
                  <Item picker>
                    <Label style={main.fontFam}>Валюта по умолчанию</Label>
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
                  <Item picker>
                    <Label style={main.fontFam}>Перенос остатка</Label>
                    <Icon name='ios-information-circle' style={main.clGrey} button onPress={this.setModalVisible} />
                    <Picker mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      itemTextStyle={main.fontFam}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.CarryOverRests}
                      onValueChange={this._balanceTransfer}
                    >
                      <Picker.Item label="Да" value={true} />
                      <Picker.Item label="Нет" value={false} />
                    </Picker>
                  </Item>
                  <Item picker>
                    <Label style={main.fontFam}>Ежемесячные платежи</Label>
                    <Picker mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.UseTemplates}
                      onValueChange={this._monthPayment}
                      enabled={false}
                    >
                      <Picker.Item label="Да" value={true} />
                      <Picker.Item label="Нет" value={false} />
                    </Picker>
                  </Item>
                </Body>
              </CardItem>
              
              <CardItem>
                <Button onPress={this._saveSettings} disabled={this.state.isChange} style={(this.state.isChange)?{}:main.bgIvan}>
                  <Text style={main.fontFam}>Сохранить изменения</Text>
                </Button>
              </CardItem>
            </Card>

            <Card>
              <CardItem button onPress={this._gotoAbout}> 
                  <Text style={main.fontFam}>О приложении</Text>
              </CardItem>
            </Card>

            <Button block danger onPress={this.logout} style={main.mt_20} iconLeft>
              <Icon ios="ios-exit" android="md-exit" />
              <Text style={main.fontFam}>Выход</Text>
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