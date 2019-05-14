import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Alert } from 'react-native'
import { Container, Icon, Fab, Spinner, Tabs, Tab } from 'native-base'

import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import ListCategoriesIncome from '../../components/ListCategoriesIncome'
import ListCategoriesExpense from '../../components/ListCategoriesExpense'
import { styles as main } from '../../Style'


class Category extends Component {
  constructor(props) {
    super(props)

    this.state = {
      CategoryType: false,
      choosenCat: -1, 
      visibleModal: true,
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
    this.props.navigation.navigate('AddEditCategory', {type:'add', CatType: this.state.CategoryType})
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

  _showModal = () => {
    this.setState({ visibleModal: true })
  }

  _hideModal = () => {
    this.setState({ visibleModal: false })
  }


  render() {
    const { navigation, categories } = this.props

    var income = []
    var expense = []

    if (!categories.isLoad) {
      categories.Categories.map(item => {
        if (!item.IsSystem) {
            if(item.IsSpendingCategory) {
              expense.push(item)
            } else {
              income.push(item)
            }
          }
      })
    }

    return (
        <Container>
          <Tabs tabBarUnderlineStyle={main.bgIvan} initialPage={0} onChangeTab={({ i }) => this._defineCatType(i)}>
            <Tab heading="Доход" 
              tabStyle={main.bgWhite} 
              activeTabStyle={main.bgWhite} 
              textStyle={main.clGrey}
              activeTextStyle={[main.clGrey, {fontWeight:'normal'}]}
            >
              {(categories.isLoad)
                ? <Spinner />
                : <ListCategoriesIncome categories={income} dropcategory={this._deleteCategory} navigation={navigation} refreshdata={this._refreshData} />
              }
            </Tab>
            <Tab heading="Расход" 
              tabStyle={main.bgWhite} 
              activeTabStyle={main.bgWhite} 
              textStyle={main.clGrey}
              activeTextStyle={[main.clGrey, {fontWeight:'normal'}]}
            >
              {(categories.isLoad)
                ? <Spinner />
                : <ListCategoriesExpense categories={expense} dropcategory={this._deleteCategory} navigation={navigation} refreshdata={this._refreshData} />
              }
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