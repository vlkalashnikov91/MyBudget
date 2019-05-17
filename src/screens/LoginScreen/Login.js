import React, {Component} from 'react'
import { Container, Label, Button, Text, Card, CardItem, Item, Input, Footer, Body, Form, Icon, Spinner, Content } from 'native-base'
import { View, Modal, Image, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'

import { UserAuth } from '../../actions/UserActions'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'

import { styles as main, screenHeight, screenWidth } from '../../Style'


class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      login: '',
      password: '',
      errlogin: false,
      errpassword: false
    }

    this._goToRegForm = this._goToRegForm.bind(this)
    this._forgotPass = this._forgotPass.bind(this)
    this._login = this._login.bind(this)
    this._checkParams = this._checkParams.bind(this)
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
      this.props.login(this.state.login, this.state.password)
    }
  }

  _hideModalLoad() {
    this.setState({ visibleModalLoad: false })
  }

  render() {
    const { user } = this.props

    return (
      <Container>
        <Grid style={[main.fD_C, {height:screenHeight}]}>
          <Row size={45}>
            <Col style={[main.jC_C, main.aI_C]}>
              <Image resizeMode='contain' resizeMethod='scale' style={{ width:screenWidth/1.8, height: 55}} source={require('../../../assets/Logo.png')}></Image>
            </Col>
          </Row>
          <Row size={55}>
            <Col style={{paddingRight: 50, paddingLeft:50}}>
              <Form style={{padding:10}}>
                <Item error={this.state.errlogin}>
                  <Icon ios='ios-man' android='md-man' style={main.clGrey}/>
                  <Input placeholder='Логин' maxLength={20} style={main.ml_10} onChangeText={this._changeLogin}/>
                </Item>
                <Item error={this.state.errpassword}>
                  <Icon android='md-key' ios='ios-key' style={main.clGrey}/>
                  <Input placeholder='Пароль' maxLength={20} secureTextEntry={true} onChangeText={this._changePassword}/>
                </Item>
              </Form>
              <Card transparent style={{paddingTop:30}}>
                <CardItem>
                  <Body>
                    <Button block success onPress={this._login}>
                      <Text>Войти</Text>
                    </Button>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Button block transparent onPress={this._forgotPass}>
                      <Text uppercase={false} note>Забыли пароль?</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Col>
          </Row>
        </Grid>

        <Footer style={main.bgWhite}>
          <Button block transparent onPress={this._goToRegForm}>
            <Text uppercase={false} note >Зарегистрироваться</Text>
          </Button>
        </Footer>

        <Modal animationType="fade"
          transparent={true}
          visible={user.isLoad}
          onRequestClose={this._hideModalLoad}
        >
          <View style={main.modalOverlay} />
            <View style={[main.jC_C, main.aI_C, main.fl_1]} >
              <Spinner size='large'/>
          </View>
        </Modal>
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
    login: (username, pass) => {
      dispatch(UserAuth.Login(username, pass))
    },
    getcategories: (UserId) => {
      dispatch(CategoriesActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)