import React, {Component} from 'react'
import { View, Text, Button } from 'react-native'
import { Icon } from 'native-base'

import Menu, { MenuItem, MenuDivider, Position } from 'react-native-enhanced-popup-menu'
 
export const HeaderPicker = (props) => {
    let textRef = React.createRef();
    let menuRef = null;
   
    const setMenuRef = ref => menuRef = ref;
    const hideMenu = () => menuRef.hide();
    const showMenu = () => menuRef.show(textRef.current, stickTo = Position.TOP_LEFT);
    const onPress = () => showMenu();

return (
    <View>
      <Text ref={textRef} style={{ fontSize: 20, textAlign: "center", display:'none' }}>Text component</Text>
      <Icon name="more" button onPress={onPress} style={{color:'white', marginRight:15}}/>
      <Menu ref={setMenuRef}>
        <MenuItem onPress={hideMenu}>Item 1</MenuItem>
        <MenuItem onPress={hideMenu}>Item 2</MenuItem>
        <MenuItem onPress={hideMenu} disabled>Item 3</MenuItem>
        <MenuDivider />
        <MenuItem onPress={hideMenu}>Item 4</MenuItem>
      </Menu>
    </View>
    )
  }