import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Spinner } from 'native-base'

import { ToastTr } from '../../components/Toast'
import { UserAuth } from '../../actions/UserActions'
import { validateEmail, charAndNums } from '../../utils/validation.js'

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
    if(nextProps.user.err.length > 0) {
      ToastTr.Danger(nextProps.user.err)
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

      return <Container>
              <Content>
                <Card>
                  <CardItem>
                    <Body>
                      <Item floatingLabel error={this.state.errLogin}>
                        <Label>Логин</Label>
                        <Input onChangeText={this._changeLogin}/>
                      </Item>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Item floatingLabel error={this.state.errEmail}>
                        <Label>Email</Label>
                        <Input onChangeText={this._changeEmail}/>
                      </Item>
                    </Body>
                  </CardItem>
                  <CardItem >
                    <Body>
                      <Item floatingLabel error={this.state.errPass}>
                        <Label>Пароль</Label>
                        <Input secureTextEntry={true} onChangeText={this._changePass}/>
                      </Item>
                    </Body>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Item floatingLabel error={this.state.errRePass}>
                        <Label>Подтверждение пароля</Label>
                        <Input secureTextEntry={true} onChangeText={this._changeRePass}/>
                      </Item>
                    </Body>
                  </CardItem>
                </Card>
                {(user.isLoad)
                ? <Spinner />
                : <Card transparent>
                  <CardItem>
                    <Body>
                      <Button block success onPress={this._registration}>
                        <Text>Зарегистрироваться</Text>
                      </Button>
                    </Body>
                  </CardItem>
                 </Card>
                }
              </Content>
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