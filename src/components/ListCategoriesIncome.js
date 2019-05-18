import React, {Component} from 'react'
import { RefreshControl } from 'react-native'
import { Body, Button, Text, ListItem, List, Icon, Left } from 'native-base'

import { styles as main } from '../Style'

export default class ListCategoriesIncome extends Component {
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
        <List dataArray = {categories}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={refreshdata}
            />
          }
          renderRow= {value => {
              return (
              <ListItem key={value.Id}
                button
                onPress={_=> navigation.navigate('AddEditCategory', {type:'edit', itemid: value.Id})}
                onLongPress={_=> dropcategory(value)}
              >
                <Body>
                  <Text style={main.clGrey}>{value.Name}</Text>
                </Body>
              </ListItem>
              )
          }}
        >
        </List>
      )
    }
}
