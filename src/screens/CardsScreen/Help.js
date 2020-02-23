import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import { Container, Content, Button, Text, Icon, Card, CardItem, H1, Segment, Left, Right, Header, Body, View, Title } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

import { styles as main  } from '../../Style'

class Help extends Component {
    render() {
      return (
        <Container>
            <Header>
                <Left>
                    <Button transparent onPress={_=> this.props.navigation.goBack()}>
                        <Icon name='arrow-back'/>
                    </Button>
                </Left>
                <Body>
                    <Title>Помощь</Title>
                </Body>
            </Header>
  
          <Content>
            <Card transparent>
                <CardItem>
                    <Body style={main.aI_C}>
                        <View style={[main.fD_R, main.aI_C]}>
                        <Button transparent>
                            <FontAwesome name='exclamation-circle' size={25} style={styles.chooseButton} />
                        </Button> 
                        <Text>У цели подходит срок</Text>
                        </View>
                        <View style={[main.fD_R, main.aI_C]}>
                        <Button transparent>
                            <FontAwesome name='fire' size={25} style={[styles.chooseButton,{color:'orange'}]} />
                        </Button>
                        <Text>Просроченная цель</Text>
                        </View>
                        <Text style={[main.mt_20, main.txtAl_c]}>Долго удерживайте цель для выбора дополнительных действий</Text>
                    </Body>
                </CardItem>
            </Card>
          </Content>
        </Container>
      )
    }
  }

  
const styles = StyleSheet.create({
    chooseButton: {
      ...main.ml_10, 
      marginRight: 10,
      height: 31,
      width: 31,
      justifyContent:'space-around',
      alignItems:'center'
    },
  })
  
  export default Help