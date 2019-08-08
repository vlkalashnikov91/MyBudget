import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl, FlatList } from 'react-native'
import { Container, Icon, Fab, Tabs, Tab, ListItem, Body, Text, Right } from 'native-base'

import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import { styles as main } from '../../Style'


class Category extends Component {
  constructor(props) {
    super(props)

    let incomeSYS = this.props.categories.Income.filter(item => item.IsSystem === true && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let incomeUser = this.props.categories.Income.filter(item => item.IsSystem === false && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let expenseSYS = this.props.categories.Expense.filter(item => item.IsSystem === true && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let expenseUser = this.props.categories.Expense.filter(item => item.IsSystem === false && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)

    this.state = {
      CategoryType: false,
      income: incomeSYS.concat(incomeUser),
      expense: expenseSYS.concat(expenseUser)
    }

    this._addCategory = this._addCategory.bind(this)
    this._refreshData = this._refreshData.bind(this)
    this._deleteCategory = this._deleteCategory.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.Error.length > 0) {
      ToastTr.Danger(nextProps.categories.Error)
    }

    let incomeSYS = nextProps.categories.Income.filter(item => item.IsSystem === true && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let incomeUser = nextProps.categories.Income.filter(item => item.IsSystem === false && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let expenseSYS = nextProps.categories.Expense.filter(item => item.IsSystem === true && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)
    let expenseUser = nextProps.categories.Expense.filter(item => item.IsSystem === false && item.Id!==30 && item.Id!==31 ).sort((a,b) => a.Name > b.Name)

    this.setState({
      income: incomeSYS.concat(incomeUser),
      expense: expenseSYS.concat(expenseUser)
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
    if (item.IsSystem) {
      ToastTr.Default('Категории со знаком "*" нельзя редактировать')
    } else {
      this.props.navigation.navigate('EditCategory', {itemid: item.Id})
    }
  }

  _deleteCategory = (item) => {
    if (item.IsSystem) {
      ToastTr.Default('Категории со знаком "*" нельзя удалять')
    } else {
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
  }

  _refreshData() {
    this.props.getcategories(this.props.user.UserId)
  }


  render() {
    const { CategoryType, income, expense } = this.state

    return (
        <Container>
          <Tabs tabBarUnderlineStyle={(CategoryType)? main.bgDanger: main.bgGreen} 
            initialPage={0} 
            onChangeTab={({ i }) => this._defineCatType(i)}
          >
            <Tab heading="Доход" 
              tabStyle={main.bgWhite} 
              activeTabStyle={main.bgWhite} 
              textStyle={[main.clIvanG, main.fontFam]}
              activeTextStyle={[main.clIvanG, main.fontFamBold]}
            >
              <FlatList
                data={income}
                keyExtractor = {(item, index) => 'key-'+item.Name + index}
                refreshControl={
                  <RefreshControl refreshing={this.props.categories.isLoad} onRefresh={this._refreshData} />
                }
                renderItem={({item}) => {
                  return (
                    <ListItem key={'cat-'+item.Id + item.Name} button
                      onPress={_=> this._editCategory(item)}
                      onLongPress={_=> this._deleteCategory(item)}
                    >
                      <Body><Text style={[main.clGrey, main.fontFam]}>{item.Name}</Text></Body>
                      {(item.IsSystem)&&
                      <Right><Icon name='star'/></Right>
                      }
                    </ListItem>
                  )
                }}
              />
            </Tab>
            <Tab heading="Расход" 
              tabStyle={main.bgWhite} 
              activeTabStyle={main.bgWhite} 
              textStyle={[main.clIvanD, main.fontFam]}
              activeTextStyle={[main.clIvanD, main.fontFamBold]}
            >
              <FlatList
                data={expense}
                keyExtractor = {(item, index) => 'key-'+item.Name + index}
                refreshControl={
                  <RefreshControl refreshing={this.props.categories.isLoad} onRefresh={this._refreshData} />
                }
                renderItem={({item}) => {
                  return (
                    <ListItem key={'cat-'+item.Id + item.Name} button
                      onPress={_=> this._editCategory(item)}
                      onLongPress={_=> this._deleteCategory(item)}
                    >
                      <Body><Text style={main.clGrey}>{item.Name}</Text></Body>
                      {(item.IsSystem)&&
                      <Right><Icon name='star'/></Right>
                      }
                    </ListItem>
                    )
                }}
              />
            </Tab>
          </Tabs>

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