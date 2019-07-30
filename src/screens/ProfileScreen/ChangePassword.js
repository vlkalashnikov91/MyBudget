import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'

import { styles as main } from '../../Style'
import { ToastTr } from '../../components/Toast'

export default class ChangePassword extends Component {
  constructor(props) {
    super(props)

    this._changePass = this._changePass.bind(this)
  }

  _changePass() {
    ToastTr.Success('Пароль изменен')
    this.props.navigation.goBack()
  }

  render() {
    return <Container>
            <Content padder>
              <Card>
                <CardItem>
                  <Body>
                    <Form style={{alignSelf: 'stretch'}}>
                      <Item floatingLabel style={{marginTop:0}}>
                        <Label style={main.fontFam}>Текущий пароль</Label>
                        <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]}/>
                      </Item>

                      <Item floatingLabel>
                        <Label style={main.fontFam}>Новый пароль</Label>
                        <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]}/>
                      </Item>

                      <Item floatingLabel>
                        <Label style={main.fontFam}>Подтверждение пароля</Label>
                        <Input secureTextEntry={true} style={[main.clGrey, main.mt_5]}/>
                      </Item>
                    </Form>
                  </Body>
                </CardItem>
              </Card>

              <Card transparent>
                <CardItem>
                  <Body>
                    <Button block onPress={this._changePass} style={main.bgGreen}>
                      <Text style={main.fontFam}>Сохранить</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
            </Content>
          </Container>
        }
}
