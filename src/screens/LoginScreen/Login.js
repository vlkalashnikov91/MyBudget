import React, {Component} from 'react'
import { Container, Label, Button, Text, Card, CardItem, Item, Input, Footer, Body, Form, Icon, Spinner } from 'native-base'
import { View, Modal, Image, NetInfo, Alert } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { connect } from 'react-redux'

import { UserAuth } from '../../actions/UserActions'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'

import { styles as main } from '../../Style'


class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      login: 'vlkalashnikov',
      password: '123456789',
    }

    this._goToRegForm = this._goToRegForm.bind(this)
    this._forgotPass = this._forgotPass.bind(this)
    this._login = this._login.bind(this)
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

  _login() {
    this.props.login(this.state.login, this.state.password)
  }

  _hideModalLoad() {
    this.setState({ visibleModalLoad: false })
  }

  render() {
    const { user } = this.props

    return (
      <Container>
        <Grid>
          <Row size={50}>
            <Col style={[main.jC_C, main.aI_C]}>
              <Image source={require('../../../assets/favicon.png')}></Image>
            </Col>
          </Row>
          <Row size={50}>
            <Col>
              <Form style={{padding:10}}>
                <Item>
                  <Icon ios='ios-man' android='md-man' style={main.clGrey}/>
                  <Input placeholder='Логин или email'/>
                </Item>
                <Item>
                  <Icon android='md-key' ios='ios-key' style={main.clGrey}/>
                  <Input placeholder='Пароль' secureTextEntry={true}/>
                </Item>
              </Form>
              <Card transparent>
                <CardItem>
                  <Body>
                    <Button block style={main.bgIvan} onPress={this._login}>
                      <Text>Войти</Text>
                    </Button>
                  </Body>
                </CardItem>
                <CardItem>
                  <Body>
                    <Button block transparent onPress={this._forgotPass}>
                      <Text uppercase={false} style={main.clIvan}>Забыли пароль</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Col>
          </Row>
        </Grid>
        
        <Footer style={main.bgWhite}>
          <Button block transparent onPress={this._goToRegForm}>
            <Text uppercase={false} style={main.clIvan}>Зарегистрироваться</Text>
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