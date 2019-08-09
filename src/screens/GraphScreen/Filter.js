import React, {Component} from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { SafeAreaView } from 'react-navigation'
import { StyleSheet, FlatList } from 'react-native'
import { Body, Content, Picker, ListItem, Text, Card, Left, Icon, Right, Segment, Button, DatePicker, Header, Title, Form, H2, H3, View } from 'native-base'
 
import { styles as main, ivanColor } from '../../Style'
import { GraphActions } from '../../actions/GraphActions'


const QUICKDATE = [
  { desc:"За последнюю неделю", range:'week'},
  { desc:"За последний месяц", range:'month'},
  { desc:"За последний год'", range: 525600 },
  { desc:"За последние 2 года'", range: (525600*2) },
]


class Filter extends Component {
  constructor(props) {
    super(props)

    this.state = {
        dateTo: new Date(),
        dateFrom: new Date()
    }

  }

  static navigationOptions = {
    header: null
  }

  _quickDate(range) {
    var start = moment()
    var end = moment()

    if(isNaN(range)) {
        start = moment().startOf(range)
    } else {
       start = start.add(-range, 'm');
    }

    this.setState({ dateTo: end, dateFrom: start})
  }

  _getgraphicdata() {
    this.props.getgraphicdata(this.props.user.UserId, this.state.dateFrom, this.state.dateTo)
    this.props.navigation.goBack()
  }

  render() {
    const { dateTo, dateFrom} = this.state

    return (
        <SafeAreaView forceInset={{top: 'always'}} style={[main.fl_1, {justifyContent:'space-between'}]}>
            <Header style={main.bgIvan}>
                <Left>
                    <Icon android='md-close' ios='ios-close' style={[main.clWhite, main.ml_20]} button onPress={_=> this.props.navigation.goBack()} />
                </Left>
                <Body><Title>Фильтр</Title></Body>
                <Right>
                    <Button transparent onPress={this._getgraphicdata}><Text style={[main.clWhite, main.fontFam]} uppercase={false}>Готово</Text></Button>
                </Right>
            </Header>
            <Content padder>
                <Text style={[main.txtAl_c, main.fontFam]}>Укажите период для поиска</Text>
                <View style={[main.fD_R, main.jC_C]}>
                  <DatePicker
                    formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                    defaultDate={dateFrom}
                    minimumDate={new Date(2016, 1, 1)}
                    maximumDate={new Date(2040, 12, 31)}
                    locale="ru"
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode="calendar"
                    placeHolderText={(dateFrom) ? moment(dateFrom).format('DD.MM.YYYY') : "От"}
                    placeHolderTextStyle={styles.textStyle}
                    textStyle={styles.textStyle}
                    onDateChange={this._changeDate}
                    disabled={false}
                  >
                    <Text>moment(dateFrom).format('DD.MM.YYYY')</Text>
                  </DatePicker>

                  <Text style={[styles.textStyle, main.mt_10]}> - </Text>

                  <DatePicker
                    formatChosenDate={date => { return moment(date).format('DD.MM.YYYY') }}
                    defaultDate={dateTo}
                    minimumDate={new Date(2016, 1, 1)}
                    maximumDate={new Date(2040, 12, 31)}
                    locale="ru"
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode="calendar"
                    placeHolderText={(dateTo) ? moment(dateTo).format('DD.MM.YYYY') : "До"}
                    placeHolderTextStyle={styles.textStyle}
                    textStyle={styles.textStyle}
                    onDateChange={this._changeDate}
                    disabled={false}
                  >
                    <Text>moment(dateTo).format('DD.MM.YYYY')</Text>
                  </DatePicker>
                </View>
                <View>
                  {QUICKDATE.map(item => {
                    return (
                      <Button key={item.desc} transparent><Text style={main.fontFam} uppercase={false} onPress={_=>this._quickDate(item.range)}>{item.desc}</Text></Button>
                    )
                  })}
                </View>
            </Content>
        </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
    textStyle: {
      ...main.clGrey,
      ...main.txtAl_c,
      ...main.fontFam,
      fontSize:20,
    },
})

const mapStateToProps = state => {
  return {
    user: state.User,
    graph: state.Graph
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getgraphicdata: (UserId, from, to) => dispatch(GraphActions.Get(UserId, from, to))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)