import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert, RefreshControl } from 'react-native'
import { Container, Icon, Fab, Tabs, Tab, ListItem, List, Body, Text, Left } from 'native-base'

import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import { styles as main } from '../../Style'


class Category extends Component {
  constructor(props) {
    super(props)

    this.state = {
      CategoryType: false
    }

    this._addCategory = this._addCategory.bind(this)
    this._refreshData = this._refreshData.bind(this)
    this._deleteCategory = this._deleteCategory.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories.Error.length > 0) {
      ToastTr.Danger(nextProps.categories.Error)
    }
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

  _refreshData() {
    this.props.getcategories(this.props.user.UserId)
  }

  render() {
    const { categories } = this.props
    const income = categories.Income.filter(item => item.IsSystem != true)
    const expense = categories.Expense.filter(item => item.IsSystem != true)

    return (
        <Container>
          <Tabs tabBarUnderlineStyle={(this.state.CategoryType)? main.bgDanger: main.bgGreen} 
            initialPage={0} 
            onChangeTab={({ i }) => this._defineCatType(i)}
          >
            <Tab heading="Доход" 
              tabStyle={main.bgWhite} 
              activeTabStyle={main.bgWhite} 
              textStyle={[main.clIvanG, main.fontFam]}
              activeTextStyle={[main.clIvanG, main.fontFamBold]}
            >
              <List dataArray = {income}
                refreshControl={
                  <RefreshControl refreshing={categories.isLoad} onRefresh={this._refreshData} />
                }
                renderRow= {value => {
                    return (
                    <ListItem key={value.Id} button
                      onPress={_=> this._editCategory(value)}
                      onLongPress={_=> this._deleteCategory(value)}
                    >
                      <Body>
                        <Text style={main.clGrey}>{value.Name}</Text>
                      </Body>
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
              <List dataArray = {expense}
                refreshControl={
                  <RefreshControl refreshing={categories.isLoad} onRefresh={this._refreshData} />
                }
                renderRow={value => {
                  return (
                    <ListItem key={value.Id} button
                      onPress={_=> this._editCategory(value)}
                      onLongPress={_=> this._deleteCategory(value)}
                    >
                      <Body>
                        <Text style={[main.clGrey, main.fontFam]}>{value.Name}</Text>
                      </Body>
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