import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl, StyleSheet } from 'react-native'
import { Container, Icon, Fab, Title, Left, Body, Text, Header, Content, Card, CardItem, Button } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import { SkypeIndicator } from 'react-native-indicators'

import ListMonthPays from '../../components/ListMonthPays'
import { styles as main, ivanColor } from '../../Style'


class MonthlyPays extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }

    this._navigateToEdit = this._navigateToEdit.bind(this)
  }

  _refreshData() {
  }

  _navigateToEdit(Id) {
    this.props.navigation.navigate('EditPayment', {itemid: Id})
  }


  render() {
    const { payments, categories } = this.props
    const isLoad = payments.isLoad || categories.isLoad

    var Pays = <SkypeIndicator color={ivanColor} />
    
    if (!isLoad) {
      if (payments.Payments.length == 0) {
        Pays = (
          <Card transparent>
            <CardItem style={main.fD_C}>
              <FontAwesome name='info-circle' size={80} style={styles.infoIcon}/>
              <Text note style={main.txtAl_c}>В этом блоке можно заводить платежи, которые будут созданы автоматический в указанный день месяца</Text>
            </CardItem>
          </Card>
        )
      } else {
        Pays = <ListMonthPays payments={payments.Payments} GoToEdit={this._navigateToEdit} />
      }
    }


    return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=>this.props.navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Ежемесячные платежи</Title>
            </Body>
          </Header>
          <Content
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} onRefresh={this._refreshData} />
            }
          >
            {Pays}
          </Content>

          <Fab style={main.bgGreen} position="bottomRight" >
            <Icon ios="ios-add" android="md-add" />
          </Fab>

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


const mapStateToProps = state => {
  return {
    user: state.User,
    payments: state.Payments,
    categories: state.Categories
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyPays)