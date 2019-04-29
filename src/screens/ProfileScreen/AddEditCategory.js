import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Container, Body, Content, Button, Text, Input, Card, CardItem, Item, Label, Spinner } from 'native-base'

import { styles as mainStyle } from '../../Style'
import { CategoriesActions } from '../../actions/CategoriesActions'
import { ToastTr } from '../../components/Toast'

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
      title: title,
      headerStyle: mainStyle.bgIvan,
      headerTitleStyle: mainStyle.clWhite,
      headerTintColor: 'white'
    }
  }

  componentDidMount() {
    let type = this.props.navigation.getParam('type', 'add')
    let itemid = this.props.navigation.getParam('itemid', -1)

    if (type === 'edit') {
      /* Если редактирование, то необходимо подобрать нужную категорию */
      let item = this.props.categories.Categories.find(el => el.Id === itemid)
      let notValid = (item.Name.length > 0 ) ? false : true
      this.setState({ Id: item.Id, Name: item.Name, IsSpendingCategory: item.IsSpendingCategory, CreatedBy: item.CreatedBy, Icon: item.Icon, notValid: notValid })
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("2")

    let txt = nextProps.navigation.getParam('type', 'add') == 'add' ? 'Категория создана' : 'Категория изменена'
    
    if(nextProps.categories.Error.length == 0) {
      ToastTr.Success(txt)
    }
    this.props.navigation.goBack()
  }

  _editCategory() {
    let st = this.state
    let type = this.props.navigation.getParam('type', 'add')

    if (type=='edit') {
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
                    <Item floatingLabel >
                      <Label>Наименование</Label>
                      <Input onChangeText={this._changeName} value={this.state.Name} style={mainStyle.clGrey}/>
                    </Item>
                  </Body>
                </CardItem>
              </Card>

              {(categories.isLoad)
              ? <Spinner />
              : <Card transparent>
                  <CardItem>
                    <Body>
                      <Button disabled={this.state.notValid} success={!this.state.notValid} block onPress={this._editCategory}>
                        <Text>Сохранить</Text>
                      </Button>
                    </Body>
                  </CardItem>
                </Card>
              }
            </Content>
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