import React, {Component} from 'react'
import { Container, View, Button, Text, Card, CardItem, Item, Input, Body, Form, Icon, CheckBox } from 'native-base'
import { Image } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'

import { UserAuth } from '../../actions/UserActions'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import { Storage } from '../../utils/deviceServices'

import { styles as main, screenHeight, screenWidth, ivanColor, ivanGray } from '../../Style'
import ModalLoading from '../../components/ModalLoading'


class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      login: '',
      password: '',
      saveMe: false,
      errlogin: false,
      errpassword: false
    }

    this._goToRegForm = this._goToRegForm.bind(this)
    this._forgotPass = this._forgotPass.bind(this)
    this._login = this._login.bind(this)
    this._saveMe = this._saveMe.bind(this)
    this._checkParams = this._checkParams.bind(this)
  }

  async componentWillMount() {
    let username = await Storage.GetItem('username')
    this.setState({ login: username,  saveMe: (username.length == 0) ? false : true})
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
      this.props.getcategories(nextProps.user.UserId)
      this.props.navigation.navigate('Home')
    }
  }

  _goToRegForm() {
    this.props.navigation.navigate('Registration')
  }

  _forgotPass() {
    this.props.navigation.navigate('ForgotPass')
  }

  _changePassword = value => {
    this.setState({ password: value })
  }

  _changeLogin = value => {
    this.setState({ login: value })
  }

  _checkParams() {
    st = this.state

    if (st.login.length === 0) {
      this.setState({ errlogin: true })
      return false
    }
    if (st.password.length === 0) {
      this.setState({ errpassword: true })
      return false
    }
    return true
  }

  _login() {
    if (this._checkParams()) {
      this.props.login(this.state.login, this.state.password, this.state.saveMe)
    }
  }

  _saveMe() {
    this.setState({ saveMe: !this.state.saveMe})
  }

  render() {
    const { user } = this.props

    return (
      <Container>
        <Grid style={[main.fD_C, {height:screenHeight}]}>
          <Row size={40}>
            <Col style={[main.jC_C, main.aI_C]}>
              <Image resizeMode='contain' resizeMethod='scale' style={{ width:screenWidth/1.8, height: 55}} source={require('../../../assets/Logo.png')}></Image>
            </Col>
          </Row>
          <Row size={60}>
            <Col style={[main.pdR_50, main.pdL_50]}>
              <Form style={{padding:10}}>
                <Item error={this.state.errlogin}>
                  <Icon ios='ios-man' android='md-man' style={main.clIvan}/>
                  <Input placeholder='Логин'value={this.state.login} maxLength={20} placeholderTextColor={ivanGray} style={[main.ml_10, main.clGrey]} onChangeText={this._changeLogin}/>
                </Item>
                <Item error={this.state.errpassword}>
                  <Icon android='md-key' ios='ios-key' style={main.clIvan}/>
                  <Input placeholder='Пароль' value={this.state.password} maxLength={20} placeholderTextColor={ivanGray} style={main.clGrey} secureTextEntry={true} onChangeText={this._changePassword}/>
                </Item>

                <View style={[main.fD_R, main.mt_10]}>
                  <CheckBox checked={this.state.saveMe} color={ivanColor} onPress={this._saveMe} />
                  <Text button onPress={this._saveMe} style={main.ml_20}>Запомнить меня</Text>
                </View>
              </Form>

              <Card transparent style={{paddingTop:30}}>
                <CardItem>
                  <Body>
                    <Button block onPress={this._login} style={main.bgGreen}>
                      <Text>Войти</Text>
                    </Button>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Button block transparent onPress={this._forgotPass}>
                      <Text uppercase={false} note>Забыли пароль?</Text>
                    </Button>

                    <Button block transparent onPress={this._goToRegForm}>
                      <Text uppercase={false} note >Зарегистрироваться</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Col>
          </Row>
        </Grid>

        <ModalLoading isActive={user.isLoad} />

      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.User,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (username, pass, saveMe) => {
      dispatch(UserAuth.Login(username, pass, saveMe))
    },
    getcategories: (UserId) => {
      dispatch(CategoriesActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)