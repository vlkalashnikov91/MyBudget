import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Form } from 'native-base'

import { styles as main } from '../../Style'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'
import ModalLoading from '../../components/ModalLoading'
import { ADD, EDIT } from '../../constants/Categories'


class AddEditCategory extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notValid: true,
      Id: -1,
      Name: '',
      IsSpendingCategory: this.props.navigation.getParam('CatType', false),
      CreatedBy: null,
      Icon: ''
    }

    this._editCategory = this._editCategory.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    let title = (navigation.getParam('type') == 'edit') ? 'Редактировать' : 'Новая категория'
    return {
      title: title
    }
  }

  componentDidMount() {
    let type = this.props.navigation.getParam('type', ADD)
    let itemid = this.props.navigation.getParam('itemid', -1)

    if (type === EDIT) {
      /* Если редактирование, то необходимо подобрать нужную категорию */
      let item = this.props.categories.Income.find(el => el.Id === itemid)

      if (item == undefined) {
        item = this.props.categories.Expense.find(el => el.Id === itemid)
      }

      if (item != undefined) {
        this.setState({ 
          Id: item.Id, 
          Name: item.Name, 
          IsSpendingCategory: item.IsSpendingCategory, 
          CreatedBy: item.CreatedBy, 
          Icon: item.Icon, 
          notValid: (item.Name.length > 0 ) ? false : true
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.categories.isLoad) {
      let txt = nextProps.navigation.getParam('type', ADD) === ADD ? 'Категория создана' : 'Категория изменена'
      
      if(nextProps.categories.Error.length == 0) {
        ToastTr.Success(txt)
      }
      this.props.navigation.goBack()
    }
  }

  _editCategory() {
    let st = this.state
    let type = this.props.navigation.getParam('type', ADD)

    if (type == EDIT) {
      this.props.editcategory(st.Id, st.Name, st.IsSpendingCategory, st.CreatedBy, st.Icon)
    } else {
      this.props.addcategory(this.props.user.UserId, st.Name, st.IsSpendingCategory)
    }
  }

  _changeName = value => {
    let notValid = true
    if (value.length > 0) {
      notValid = false
    }
    this.setState({ Name: value, notValid: notValid })
  }

  render() {
    const { categories } = this.props

    return <Container>
            <Content padder>
              <Card>
                <CardItem>
                  <Body>
                    <Form style={{alignSelf: 'stretch'}}>
                      <Item stackedLabel last>
                        <Label>Наименование</Label>
                        <Input onChangeText={this._changeName} value={this.state.Name} style={main.clGrey}/>
                      </Item>
                    </Form>
                  </Body>
                </CardItem>
              </Card>
              <Card transparent>
                <CardItem>
                  <Body>
                    <Button disabled={this.state.notValid} style={(this.state.notValid) ? {} : main.bgGreen} block onPress={this._editCategory}>
                      <Text style={main.fontFam}>Сохранить</Text>
                    </Button>
                  </Body>
                </CardItem>
              </Card>
          </Content>

          <ModalLoading isActive={categories.isLoad} />

        </Container>
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
    addcategory:(UserId, Name, IsSpendingCategory) => {
      dispatch(CategoriesActions.Add(UserId, Name, IsSpendingCategory))
    },
    editcategory:(Id, Name, IsSpendingCategory, CreatedBy, Icon) => {
      dispatch(CategoriesActions.Edit(Id, Name, IsSpendingCategory, CreatedBy, Icon))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEditCategory)