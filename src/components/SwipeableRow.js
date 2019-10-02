import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native'
import { RectButton, Swipeable } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'


export default class SwipeableRow extends Component {
    renderRightActions = (progress, dragX) => (
        <RectButton style={styles.rightAction} onPress={this.close}>
            <Text style={styles.actionText}>Удалить</Text>
            <MaterialIcons name="delete-forever" size={25} color="#fff" style={styles.actionIcon} />
        </RectButton>
    )

    updateRef = ref => {
        this._swipeableRow = ref
    }

    close = () => {
      this.props.rightFunc(this.props.itemId)
      setTimeout(() => {
        this._swipeableRow.close()
      }, 1200)
    }

    render() {
        const { children } = this.props
        return (
            <Swipeable
                ref={this.updateRef}
                onSwipeableRightOpen={this.close}
                friction={2}
                leftThreshold={80}
                rightThreshold={40}
                renderRightActions={this.renderRightActions}>
                {children}
            </Swipeable>
        )
    }
}

const styles = StyleSheet.create({
  actionIcon: {
    width: 25,
    marginHorizontal: 10,
  },
  actionText: {
    fontSize:15,
    color:'white'
  },
  rightAction: {
    alignItems: 'center',
    backgroundColor: '#dd2c00',
    flex: 1,
    flexDirection:'row',
    justifyContent: 'flex-end',
  },
});