import React, {Component} from 'react'
import { RefreshControl } from 'react-native'
import { Body, Button, Text, ListItem, List, Icon, Left } from 'native-base'

import { styles as mainStyle } from '../Style'

export default class ListCategoriesExpense extends Component {
    constructor(props) {
      super(props)

      this.state = {
        categories: this.props.categories,
        refreshing: false,
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (JSON.stringify(nextProps.categories) == JSON.stringify(this.state.categories)) {
        return false
      }
      return true
    }

    render() {
      const { navigation, categories, dropcategory, refreshdata } = this.props

      return (
        <List
          dataArray = {categories}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={refreshdata}
            />
          }

          renderRow={value => {
            return (
              <ListItem key={value.Id}
                button
                onPress={()=> navigation.navigate('AddEditCategory', {type:'edit', itemid: value.Id})}
                onLongPress={() => dropcategory(value)}
              >
                <Body>
                  <Text style={mainStyle.clGrey}>{value.Name}</Text>
                </Body>
              </ListItem>
              )
          }}
        >
        </List>
      )
    }
}