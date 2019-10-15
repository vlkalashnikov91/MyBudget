import React, {Component} from 'react'
import { StyleSheet, BackHandler } from 'react-native'
import { Container, Content, Button, Text, Card, CardItem, Body, Title, Header } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import { styles as main } from '../../Style'


export default class ForgotPassInfo extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
    }

    handleBackButton() {
        return true
    }

    render() {
      return (
        <Container>
            <Header>
                <Body>
                    <Title style={main.ml_15}>Восстановление пароля</Title>
                </Body>
            </Header>
            <Content padder>
                <Card transparent style={[main.aI_C, {paddingTop:50, marginBottom:30}]}>
                    <CardItem style={main.fD_C}>
                        <FontAwesome name='info-circle' size={80} style={styles.infoIcon}/>
                        <Text style={main.txtAl_c}>На указанный адрес мы выслали письмо с новым паролем. В целях безопасности рекомендуем сменить его в личном кабинете.</Text>
                    </CardItem>
                </Card>
                <Card transparent>
                    <CardItem>
                        <Body>
                            <Button block style={main.bgIvan} onPress={_=>this.props.navigation.navigate('Login')}>
                                <Text style={[main.clWhite]}>На страницу входа</Text>
                            </Button>
                        </Body>
                    </CardItem>
                </Card>
            </Content>
        </Container>
      )
  }
}


const styles = StyleSheet.create({
    infoIcon: {
      color:'#609AD3', 
      marginBottom:35, 
      marginTop:10, 
      opacity:0.8
    }
  })