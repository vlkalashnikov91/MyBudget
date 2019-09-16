import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl, FlatList } from 'react-native'
import { Container, Icon, Fab, Title, Left, Body, Text, Header, ListItem, Card, CardItem, Button, Tabs, Tab, Right, Content } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

import { styles as main, ivanColor } from '../../Style'
import { TemplatesActions } from '../../actions/TemplatesActions'
import { INCOME, EXPENSE } from '../../constants/Payment'
import { ToastTr } from '../../components/Toast'
import { SummMask } from '../../utils/utils'


const notFound = (
  <Card transparent>
    <CardItem style={main.fD_C}>
      <FontAwesome name='info-circle' size={80} style={{color:'#609AD3', marginBottom:35, marginTop:10, opacity:0.8}}/>
      <Text note style={main.txtAl_c}>В этом блоке можно заводить платежи, которые будут созданы автоматический в указанный день месяца</Text>
    </CardItem>
  </Card>
)


class MonthlyPays extends Component {
  constructor(props) {
    super(props)

    this.state = {
      CategoryType: INCOME,
    }

    this._refreshData = this._refreshData.bind(this)
    this._addMonthPay = this._addMonthPay.bind(this)
    this._createPaysArr = this._createPaysArr.bind(this)
    this._createListPays = this._createListPays.bind(this)
    this._definePayCat = this._definePayCat.bind(this)

  }

  componentDidMount() {
    if (this.props.templates.Templates.length === 0) {
      this.props.gettemplatelist(this.props.user.UserId)
    } else {
      var income = this._createPaysArr('INCOME', this.props.templates.Templates)
      var expense = this._createPaysArr('EXPENSE', this.props.templates.Templates)
      this.setState(prevState => ({income: income, expense: expense}))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.templates.Error.length > 0) {
      ToastTr.Danger(nextProps.templates.Error)
    }

    var income = this._createPaysArr('INCOME', nextProps.templates.Templates)
    var expense = this._createPaysArr('EXPENSE', nextProps.templates.Templates)
    this.setState(prevState => ({income: income, expense: expense}))
  }

  _createPaysArr(type, templates){
    var arr = []
    if (type === INCOME) {
      arr = templates.filter(item => {
        if (item.CategoryId === null) {
          return false
        }
  
        let CatDesc = this.props.categories.Income.find(el => el.Id === item.CategoryId)
  
        if (CatDesc == undefined) {
          return false
        }
        return true
      })
    } else {
      arr = templates.filter(item => {
        if (item.CategoryId === null) {
          return false
        }
  
        let CatDesc = this.props.categories.Expense.find(el => el.Id === item.CategoryId)
  
        if (CatDesc == undefined) {
          return false
        }
  
        return true
      })
    }

    return arr.sort((a,b) => a.Name > b.Name)
  }

  _definePayCat(item) {
    if (item.CategoryId == null) {
      return { Name:'Не указано', IsSpendingCategory: item.IsSpending } 
    } else {
      let CatDesc = this.props.categories.Income.find(el => el.Id === item.CategoryId)

      if (CatDesc == undefined) {
        CatDesc = this.props.categories.Expense.find(el => el.Id === item.CategoryId)
      }
      return CatDesc
    }
  }

  _createListPays(type){
    var arr = []

    if (type === INCOME){
      arr = this.state.income
    } else {
      arr = this.state.expense
    }

    return (
      <FlatList
        data={arr}
        keyExtractor = {(item, index) => 'mpay-key-'+item.Day + index}
        renderItem={({item}) => {
          let CatDesc = this._definePayCat(item)
          return (
            <ListItem key={'mpay-'+item.Id + item.Day + CatDesc.Name} icon
              onPress={_=> this._editMonthPay(item)}
              onLongPress={_=> this._deleteMonthPay(item)}
            >
              <Body>
                {((item.Name==null) || (item.Name.length === 0))
                ? <Text style={main.clGrey}>---</Text>
                : <Text style={main.clGrey} numberOfLines={1}>{item.Name}</Text>
                }
                <Text note>{CatDesc.Name}</Text>
              </Body>

              <Right style={[main.fD_C, {alignItems:'flex-end'}]}>
              {(CatDesc.IsSpendingCategory) 
                ? <Text style={main.clIvanD}> - {SummMask(item.Amount)} {this.props.user.DefCurrency}</Text>
                : <Text style={main.clIvanG}> + {SummMask(item.Amount)} {this.props.user.DefCurrency}</Text>
              }
                <Text note>День платежа: {item.Day}</Text>
              </Right>
            </ListItem>
          )
        }}
      />
    )
  }

  _toggleCat(i) {
    let cur = (i == 0) ? INCOME : EXPENSE
    this.setState({ CategoryType: cur})
  }

  _addMonthPay() {
    this.props.navigation.navigate('AddMonthPay', {type: this.state.CategoryType})
  }

  _refreshData() {
    this.props.gettemplatelist(this.props.user.UserId)
  }

  _editMonthPay(item) {
    this.props.navigation.navigate('EditMonthPay', {itemid: item.Id})
  }

  _deleteMonthPay(item) {
    Alert.alert(
      `Удаление`,
      `Удалить ежемесячный платеж?`,
      [
        {text: 'Нет'},
        {text: 'Да', onPress: ()=> {
          this.props.deletetemplate(item.Id)
        }
        },
      ]
    )
  }

  render() {
    const { categories, templates, navigation } = this.props
    const { CategoryType } = this.state

    const isLoad = categories.isLoad || templates.isLoad
    const incomeARR = this._createListPays(INCOME)
    const expenseARR = this._createListPays(EXPENSE)

    return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=>navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Ежемесячные платежи</Title>
            </Body>
          </Header>
          <Content enableOnAndroid refreshControl = {
            <RefreshControl refreshing={isLoad} onRefresh={this._refreshData} />
          }
          >
            <Tabs tabBarUnderlineStyle={(CategoryType===EXPENSE)? main.bgDanger: main.bgGreen} initialPage={0} onChangeTab={({ i }) => this._toggleCat(i)} >
              <Tab heading="Доход" 
                tabStyle={main.bgWhite}
                activeTabStyle={main.bgWhite} 
                textStyle={main.clIvanG}
                activeTextStyle={[main.clIvanG, main.fontFamBold]}
              >
                {(templates.Templates.length === 0)
                ? (
                  notFound
                ) : (
                  incomeARR
                )}
              </Tab>
              <Tab heading="Расход" 
                tabStyle={main.bgWhite} 
                activeTabStyle={main.bgWhite} 
                textStyle={main.clIvanD}
                activeTextStyle={[main.clIvanD, main.fontFamBold]}
              >
                {(templates.Templates.length === 0)
                ? (
                  notFound
                ) : (
                  expenseARR
                )}
              </Tab>
            </Tabs>
          </Content>

          <Fab style={main.bgGreen} position="bottomRight" onPress={this._addMonthPay}>
            <Icon ios="ios-add" android="md-add" />
          </Fab>

        </Container>
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.User,
    categories: state.Categories,
    templates: state.Templates
  }
}

const mapDispatchToProps = dispatch => {
  return {
    gettemplatelist: (UserId) => dispatch(TemplatesActions.Get(UserId)),
    deletetemplate: (id) => dispatch(TemplatesActions.Delete(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyPays)