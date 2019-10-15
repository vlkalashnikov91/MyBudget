import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl, FlatList } from 'react-native'
import { Container, Icon, Fab, Tabs, Tab, ListItem, Body, Text, Button, Header, Left, Title, Content, TabHeading, Right } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'

import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import { styles as main, ivanGray } from '../../Style'


class Category extends Component {
  constructor(props) {
    super(props)

    let incomeUser = this.props.categories.Income.filter(item => item.IsSystem === false && item.Id!==1 && item.Id!==2 ).sort((a,b) => a.Name > b.Name)
    let expenseUser = this.props.categories.Expense.filter(item => item.IsSystem === false && item.Id!==1 && item.Id!==2 ).sort((a,b) => a.Name > b.Name)

    this.state = {
      CategoryType: false,
      income: incomeUser,
      expense: expenseUser
    }

    this._addCategory = this._addCategory.bind(this)
    this._refreshData = this._refreshData.bind(this)
    this._deleteCategory = this._deleteCategory.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.Error.length > 0) {
      ToastTr.Danger(nextProps.categories.Error)
    }

    let incomeUser = nextProps.categories.Income.filter(item => item.IsSystem === false && item.Id!==1 && item.Id!==2 ).sort((a,b) => a.Name > b.Name)
    let expenseUser = nextProps.categories.Expense.filter(item => item.IsSystem === false && item.Id!==1 && item.Id!==2 ).sort((a,b) => a.Name > b.Name)

    this.setState({
      income: incomeUser,
      expense: expenseUser
    })

  }

  _defineCatType(i) {
    let cur = (i == 0) ? false : true
    this.setState({ CategoryType: cur})
  }

  _addCategory() {
    this.props.navigation.navigate('AddCategory', {CatType: this.state.CategoryType})
  }

  _editCategory(item) {
    this.props.navigation.navigate('EditCategory', {itemid: item.Id})
  }

  _deleteCategory = (item) => {
    Alert.alert(
      `${item.Name}`,
      `Удалить категорию "${item.Name}"?`,
      [
        {text: 'Нет'},
        {text: 'Да', onPress: ()=> {
          this.props.deletecategory(this.props.user.UserId, item.Id)
        }
        },
      ]
    )
  }

  _createCatList(list) {
    return (
      <FlatList
        data={list}
        keyExtractor = {(item, index) => 'key-'+item.Id + index}
        renderItem={({item}) => {
          return (
            <ListItem button
              onPress={_=> (item.CreatedBy !== null) ? this._editCategory(item) : null}
              onLongPress={_=> this._deleteCategory(item)}
            >
              <Body><Text style={main.clGrey}>{item.Name}</Text></Body>
              {(item.CreatedBy !== null) && <Right><FontAwesome name="pencil" size={20} style={{color:ivanGray}}/></Right>}
            </ListItem>
          )
        }}
      />
    )
  }

  _refreshData() {
    this.props.getcategories(this.props.user.UserId)
  }

  render() {
    const { categories, navigation } = this.props
    const { CategoryType, income, expense } = this.state

    const incomeList = this._createCatList(income)
    const expenseList = this._createCatList(expense)

    return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={_=> navigation.goBack()}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Мои категории</Title>
            </Body>
          </Header>
          <Content enableOnAndroid refreshControl = {
            <RefreshControl refreshing={categories.isLoad} onRefresh={this._refreshData} />
          }
          >
            <Tabs tabBarUnderlineStyle={(CategoryType)? main.bgDanger: main.bgGreen} 
              initialPage={0} 
              onChangeTab={({ i }) => this._defineCatType(i)}
            >
              <Tab heading={
                <TabHeading style={main.bgWhite} activeTextStyle={main.fontFamBold} >
                  <Text style={main.clIvanG}>Доход</Text>
                </TabHeading>
              }
              >
                {incomeList}
              </Tab>
              <Tab heading={
                <TabHeading style={main.bgWhite} activeTextStyle={main.fontFamBold} >
                  <Text style={main.clIvanD}>Расход</Text>
                </TabHeading>
              }
              >
                {expenseList}
              </Tab>
            </Tabs>
          </Content>

          <Fab style={main.bgGreen} position="bottomRight" onPress={this._addCategory} >
            <Icon ios="ios-add" android="md-add" />
          </Fab>

        </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.Categories,
    user: state.User
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deletecategory:(UserId, id) => {
      dispatch(CategoriesActions.Delete(UserId, id))
    },
    getcategories: (UserId) => {
      dispatch(CategoriesActions.Get(UserId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Category)