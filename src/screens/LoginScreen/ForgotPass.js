import React, {Component} from 'react'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Spinner } from 'native-base'

export default class ForgotPass extends Component {
  render() {
      return <Container>
              <Content>
                <Card style={{ alignItems:'center'}}>
                  <CardItem>
                    <Body>
                      <Item floatingLabel>
                        <Label>Email</Label>
                        <Input/>
                      </Item>
                    </Body>
                  </CardItem>
                </Card>
                <Card transparent>
                  <CardItem>
                    <Body>
                      <Button block primary>
                        <Text>Отправить</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              </Content>
            </Container>
  }
}