import React, { Component } from 'react'
import { View,  Picker, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Button, Card, CardItem, Body } from 'native-base'
import moment from 'moment'

import { styles as main } from '../Style'
import { capitalize } from '../utils/utils'

const Months = Array.apply(0, Array(12)).map(function(_,i){return {Name: capitalize(moment().month(i).format('MMMM')), Id: i}})

export default class YearMonthPicker extends Component {
    constructor(props) {
        super(props);

        let { startYear, endYear, selectedYear, selectedMonth, visible } = props
        let years = this.getYears(startYear, endYear)
        let months = Months
        selectedYear = selectedYear || years[0]
        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1)

        this.state = {
            years,
            months,
            selectedYear,
            selectedMonth,
            visible: visible || false
        }
    }

    show = async ({startYear, endYear, selectedYear, selectedMonth}) => {
        let years = this.getYears(startYear, endYear)
        let months = Months
        selectedYear = selectedYear || years[0]
        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1)

        let promise = new Promise((resolve) => {
            this.confirm = (year, month) => {
                resolve({ year, month });
            }

            this.setState({
                visible: true,
                years,
                months,
                startYear: startYear,
                endYear: endYear,
                selectedYear: selectedYear,
                selectedMonth: selectedMonth,
            })
        })
        return promise;
    }

    dismiss = () => {
        this.setState({ visible: false })
    }

    getYears = (startYear, endYear) => {
        startYear = startYear || (new Date()).getFullYear();
        endYear = endYear || (new Date()).getFullYear();
        let years = []
        for (let i = startYear; i <= endYear; i++) {
            years.push(i)
        }
        return years;
    }

    renderYearPicker = (data) => {
        let items = data.map((item, index) => {
            return (<Picker.Item key={'r-' + index} label={'' + item} value={item} />)
        })
        return items;
    }

    renderMonthPicker = (data) => {
        let items = data.map((item, index) => {
            return (<Picker.Item key={'r-' + index} label={'' + item.Name} value={item.Id} />)
        })
        return items;
    }

    onConfirmPress = () => {
        const confirm = this.confirm;
        const { selectedYear, selectedMonth } = this.state;
        confirm && confirm(selectedYear, selectedMonth);
        this.dismiss();
    }

    render() {
        const { years, months, selectedYear, selectedMonth, visible } = this.state

        if (!visible) return null;
        return (
                <TouchableOpacity style={styles.modal} onPress={this.dismiss}>
                    <View style={styles.modalWindow}>
                        <Card transparent>
                            <CardItem>
                                <TouchableOpacity style={styles.toolBar} onPress={_=> null} activeOpacity={1}>
                                    <Text style={main.fontFamBold}>Месяц</Text>
                                    <Text style={main.fontFamBold}>Год</Text>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem>
                                <Body style={[main.fD_R, main.aI_C]}>
                                    <Picker style={main.fl_1}
                                        selectedValue={selectedMonth}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ selectedMonth: itemValue })}
                                    >
                                        {this.renderMonthPicker(months)}
                                    </Picker>

                                    <Picker style={main.fl_1}
                                        selectedValue={selectedYear}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ selectedYear: itemValue })}
                                    >
                                        {this.renderYearPicker(years)}
                                    </Picker>
                                </Body>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Button block style={main.bgIvan} onPress={this.onConfirmPress}>
                                        <Text>Выбрать</Text>
                                    </Button>
                                </Body>
                        </CardItem>
                    </Card>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    toolBar: {
        width:'100%',
        justifyContent:'space-around',
        ...main.fD_R
    },
    modalWindow: {
        ...main.bgWhite,
        marginHorizontal: 5,
        marginBottom: 5,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    }
})