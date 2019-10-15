import React, {Component} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Container, View, Button, Text, Item, Input, Form, Icon, CheckBox, Content } from 'native-base'
import { Image } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'

import { UserAuth } from '../../actions/UserActions'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { Storage } from '../../utils/deviceServices'

import { styles as main, screenHeight, screenWidth, ivanColor } from '../../Style'


class Login extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      login: '',
      password: '',
      saveMe: false,
      errlogin: false,
      errpassword: false,
      icon: 'eye-off',
      isHiddenPass: true,
    }

    this._goToRegForm = this._goToRegForm.bind(this)
    this._forgotPass = this._forgotPass.bind(this)
    this._login = this._login.bind(this)
    this._saveMe = this._saveMe.bind(this)
    this._checkParams = this._checkParams.bind(this)
  }

  async componentWillMount() {
    let username = await Storage.GetItem('username')
    let password = await Storage.GetItem('password')
    this.setState({ login: username,  password: password, saveMe: (username.length == 0) ? false : true})
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
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

  _togglePass() {
    this.setState(prevState => ({
      icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
      isHiddenPass: !prevState.isHiddenPass
    }))
  }

  _saveMe() {
    this.setState(prevState => ({ saveMe: !prevState.saveMe}))
  }

  render() {
    const { user } = this.props
    const { login, errlogin, password, errpassword, isHiddenPass, icon, saveMe } = this.state

    return (
      <Container>
        <LinearGradient colors={[ivanColor, ivanColor, '#30cfd0']} style={main.fl_1} >
          <Content enableOnAndroid>
            <Grid style={[main.fD_C, {height:screenHeight}]}>
              <Row size={30}>
                <Col style={[main.jC_C, main.aI_C]}>
                  <Image resizeMode='contain' resizeMethod='scale' style={{ width:screenWidth/1.8, height: 55}} source={require('../../../assets/Logo_white.png')}></Image>
                </Col>
              </Row>
              <Row size={60}>
                <Col style={[main.pdR_50, main.pdL_50]}>
                  <Form style={{padding:10}}>
                    <Item error={errlogin}>
                      <Input placeholder='Логин' 
                        value={login}
                        maxLength={20} 
                        placeholderTextColor='white' 
                        style={main.clWhite} 
                        onChangeText={this._changeLogin}
                        returnKeyType={'next'}
                        blurOnSubmit={false}
                        onSubmitEditing={_=>this.inputPass._root.focus()}
                      />
                    </Item>
                    <Item error={errpassword}>
                      <Input placeholder='Пароль'
                        value={password} 
                        maxLength={20} 
                        placeholderTextColor='white' 
                        style={main.clWhite} 
                        secureTextEntry={isHiddenPass}
                        onChangeText={this._changePassword}
                        onSubmitEditing={this._login}
                        ref={input => { this.inputPass = input }}
                      />
                      <Icon name={icon} onPress={_=> this._togglePass()} style={main.clWhite}/>
                    </Item>

                    <View style={[main.fD_R, main.mt_10, main.jC_C]}>
                      <CheckBox checked={saveMe} color={ivanColor} onPress={this._saveMe} />
                      <Text button onPress={this._saveMe} style={[main.ml_20, main.clWhite]}>Запомнить меня</Text>
                    </View>

                    <Button block onPress={this._login} style={[{marginTop:25}, main.bgIvan]}>
                      {(user.isLoad)
                      ? <Text>Загрузка...</Text>
                      : <Text>Войти</Text>
                      }
                    </Button>

                    <Button block transparent onPress={this._forgotPass} style={main.mt_10}>
                      <Text style={main.clWhite} uppercase={false} note>Забыли пароль?</Text>
                    </Button>

                    <Button block transparent onPress={this._goToRegForm} style={main.mt_10}>
                      <Text style={main.clWhite} uppercase={false} note >Зарегистрироваться</Text>
                    </Button>

                  </Form>
                </Col>
              </Row>
            </Grid>
          </Content>
        </LinearGradient>

        <ModalLoading isActive={user.isLoad} color='white' />
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)