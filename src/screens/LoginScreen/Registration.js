import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'

import ModalLoading from '../../components/ModalLoading'
import { ToastTr } from '../../components/Toast'
import { UserAuth } from '../../actions/UserActions'
import { validateEmail } from '../../utils/utils.js'
import { styles as main } from '../../Style'


class Registration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Login: '',
      Email: '',
      Password: '',
      RePassword: '',
      errLogin: false,
      errPass: false,
      errEmail: false,
      errRePass: false
    }

    this._registration = this._registration.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.user.Error.length > 0) {
      ToastTr.Danger(nextProps.user.Error)
    } else if (nextProps.user.UserId.length > 0) {
      this.props.navigation.navigate('FirstSettings')
    }
  }

  _changeLogin = value => {
    this.setState({Login: value})
  }

  _changeEmail = value => {
    this.setState({Email: value})
  }

  _changePass = value => {
    this.setState({Password: value})
  }

  _changeRePass = value => {
    this.setState({RePassword: value})
  }

  _checkParams() {
    st = this.state

    if (st.Login.length == 0) {
      this.setState({ errLogin: true })
      return false
    }
    if (st.Email.length == 0) {
      this.setState({ errEmail: true })
      return false
    }
    if (st.Password.length == 0) {
      this.setState({ errPass: true })
      return false
    }
    if (st.RePassword.length == 0) {
      this.setState({ errRePass: true })
      return false
    }

    if(validateEmail(st.Email) === false)
    {
      this.setState({ errEmail: true })
      ToastTr.Danger('Email is Not Correct')
      return false
    }

    if(st.Password != st.RePassword) {
      this.setState({ errPass: true })
      this.setState({ errRePass: true })
      ToastTr.Danger('Пароли не совпадают')
      return false 
    }

    return true
  }

  _registration() {
    if(this._checkParams()) {
      this.props.goToReg(this.state.Login, this.state.Email, this.state.Password)
    }
  }

  render() {
      const { user } = this.props
      const { errLogin, errEmail, errPass, errRePass } = this.state

      return <Container>
              <Content padder>
                <Card>
                  <CardItem>
                    <Body>
                      <Form style={{alignSelf: 'stretch'}}>
                        <Item floatingLabel error={errLogin}>
                          <Label style={main.fontFam}>Логин</Label>
                          <Input onChangeText={this._changeLogin} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                        </Item>

                        <Item floatingLabel error={errEmail}>
                          <Label style={main.fontFam}>Email</Label>
                          <Input onChangeText={this._changeEmail} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                        </Item>

                        <Item floatingLabel error={errPass}>
                          <Label style={main.fontFam}>Пароль</Label>
                          <Input secureTextEntry={true} onChangeText={this._changePass} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                        </Item>

                        <Item floatingLabel error={errRePass}>
                          <Label style={main.fontFam}>Подтверждение пароля</Label>
                          <Input secureTextEntry={true} onChangeText={this._changeRePass} style={[main.clGrey, main.fontFam, main.mt_5]}/>
                        </Item>
                      </Form>
                    </Body>
                  </CardItem>
                </Card>
                
                <Card transparent>
                  <CardItem>
                    <Body>
                      <Button block onPress={this._registration} style={main.bgGreen}>
                        <Text style={main.fontFam}>Далее</Text>
                      </Button>
                    </Body>
                  </CardItem>
                 </Card>

              </Content>

              <ModalLoading isActive={user.isLoad} />

            </Container>
  }
}

const mapStateToProps = state => {
  return {
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goToReg:(Login, Email, Password) => {
      dispatch(UserAuth.Registration(Login, Email, Password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)