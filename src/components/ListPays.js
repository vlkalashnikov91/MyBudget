import React, {Component} from 'react'
import { Alert, StyleSheet, PixelRatio } from 'react-native'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Text, Icon, Spinner, View } from 'native-base'
import { FlatList, RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'

import { PaymentActions } from '../actions/PaymentActions'
import { styles as main } from '../Style'
import { SummMask } from '../utils/utils'
import SwipeableRow from './SwipeableRow'

class ListPays extends Component {
    constructor(props) {
      super(props)

      this.state = {
        planedPay: -1,
      }

      this._definePayCat = this._definePayCat.bind(this)
      this._deletePay = this._deletePay.bind(this)
    }

    componentWillReceiveProps() {
      this.setState({ planedPay: -1 })
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

    _choosePayments(item) {
      this.setState({ planedPay: item.Id })
      this.props.editpayment(item.Id, item.CategoryId, item.Amount, item.Name, item.TransDate, item.IsSpending, !item.IsPlaned) 
    }

    _deletePay(Id) {
      var item = this.props.payments.filter(val => val.Id === Id)
      Alert.alert(
          `${item[0].Name}`,
          'Удалить платеж?',
          [
            {text: 'Нет', onPress: ()=> {}
            },
            {text: 'Да', onPress: ()=> {
                this.props.deletepayment(item[0].Id)
              }
            },
          ]
        )
    }

    renderItem = ({ item }) => {
      let { user } = this.props
      let { planedPay } = this.state
      let CatDesc = this._definePayCat(item)
      let Name = ((item.Name==null) || (item.Name.length === 0)) ? '---' : item.Name
      return (
        <SwipeableRow rightFunc={this._deletePay} itemId={item.Id} >
          <View style={styles.row}>
            {(planedPay === item.Id)
              ? <Button rounded light style={styles.chooseButton}><Spinner size="small"/></Button>
              : <Button rounded bordered
                  hitSlop={styles.hitSlop}
                  success={(!item.IsPlaned)} 
                  light={(item.IsPlaned)} 
                  style={styles.chooseButton}
                  onPress={_=> this._choosePayments(item)}
                >
                  <Feather name="check" size={18} style={(item.IsPlaned)?{color:'#d8d8d8'}:main.clIvanG}/>
              </Button>
            }
            <RectButton onPress={_=> this.props.GoToEdit(item.Id)} style={main.fl_1}>
              <View style={styles.rectView}>
                <View style={main.fl_1}>
                  <Text numberOfLines={1}>{Name}</Text>
                  <Text note numberOfLines={1}>{CatDesc.Name}</Text>
                </View>
                <View style={[main.fD_C, main.aI_E]}>
                  {(CatDesc.IsSpendingCategory) 
                  ? <Text style={[main.clIvanD, main.fontFamBold]}> - {SummMask(item.Amount)} {user.DefCurrency}</Text>
                  : <Text style={[main.clIvanG, main.fontFamBold]}> + {SummMask(item.Amount)} {user.DefCurrency}</Text>
                  }
                  <Text note>{moment(item.TransDate).format('DD.MM.YYYY')}</Text>
                </View>
              </View>
            </RectButton>
          </View>
        </SwipeableRow>
      )
    }

    render() {
      const { payments } = this.props

      return (
        <FlatList
          data={payments}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `message ${index}`}
        />
      )
    }
}

const styles = StyleSheet.create({
  row: {
    height: 50,
    paddingLeft: 2,
    ...main.bgWhite,
    ...main.fD_R,
    ...main.aI_C, 
    ...main.fl_1
  },
  rectView: {
    ...main.fl_1,
    ...main.fD_R,
    ...main.aI_C,
    justifyContent:'space-between',
    paddingLeft: 8,
    paddingRight:8,
    borderColor:'#c9c9c9', 
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1)
  },
  chooseButton: {
    ...main.ml_10, 
    marginRight: 2,
    height: 31,
    width: 31,
    justifyContent:'space-around',
    alignItems:'center'
  },
  hitSlop: {
    top:10, 
    left:10, 
    bottom:10, 
    right:10
  }
})


const mapStateToProps = state => {
  return {
    user: state.User,
    categories: state.Categories,
  }
}

const mapDispatchToProps = dispatch => {
    return {
      deletepayment: (id) => dispatch(PaymentActions.Delete(id)),
      editpayment: (Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned) => {
        dispatch(PaymentActions.Edit(Id, CategoryId, Amount, Name, TransDate, IsSpending, IsPlaned))
      }
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(ListPays)