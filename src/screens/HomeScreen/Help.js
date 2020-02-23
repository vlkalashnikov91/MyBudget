import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import { Container, Content, Button, Text, Icon, Card, CardItem, H1, Segment, Left, Right, Header, Body, View, ListItem, Title } from 'native-base'
import { Feather } from '@expo/vector-icons'
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
                <CardItem header>
                    <Text style={main.fontFamBold}>Планирование</Text>
                </CardItem>
                <CardItem>
                    <Body>
                    <Text>"Плановый" баланс позволяет отследить остаток средств с учетом еще не проведенных, но запланированных выплат.</Text>
                    <View style={[main.fD_R, main.aI_C, main.mt_10]}>
                        <Button rounded bordered success={false} light={true} style={styles.chooseButton}>
                        <Feather name="check" size={18} style={{color:'#d8d8d8'}}/>
                        </Button>
                        <Text>Запланированный платеж</Text>
                    </View>
                    <View style={[main.fD_R, main.aI_C, main.mt_10, main.mb_5]}>
                        <Button rounded bordered success={true} light={false} style={styles.chooseButton} >
                        <Feather name="check" size={18} style={main.clIvanG}/>
                        </Button>
                        <Text>Проведенный платеж</Text>
                    </View>
                    <Text>Чтобы перевести платеж в статус "запланированный" нажмите на галочку перед наименованием платежа.</Text>
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