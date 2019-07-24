import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'
import { styles as main } from '../../Style'

export default class ForgotPass extends Component {
  render() {
      return <Container>
              <Content>
                <Card>
                  <CardItem>
                    <Body>
                      <Form style={{alignSelf: 'stretch'}}>
                        <Item stackedLabel>
                          <Label>Email</Label>
                          <Input />
                        </Item>
                      </Form>
                    </Body>
                  </CardItem>
                </Card>
                <Card transparent>
                  <CardItem>
                    <Body>
                      <Button block style={main.bgGreen}>
                        <Text style={main.fontFam}>Отправить</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              </Content>
            </Container>
  }
}