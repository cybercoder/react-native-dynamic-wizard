import React,{Component} from 'react'
import {createDrawerNavigator} from 'react-navigation'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import {StyleSheet,Text,Image, ImageBackground, AsyncStorage, } from 'react-native'
import {Container,Content, Body,Title, Header, Left,Right,Icon ,Button, List, ListItem,Switch} from 'native-base'
import Expo from 'expo'

import config from '../config'

import Tabs from './Tabs'


class Profile extends Component {
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
      }    
    render() {
        return(
            <Container>
                <Content>
                    <ImageBackground
                        source={{
                            uri: `${config.ServerURI}/static/images/abs.jpg`
                        }}
                        style={{
                            height: 120,
                            alignSelf: "stretch",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Image
                            square
                            style={{ height: 80, width: 70 }}
                            source={{
                                uri: `${config.ServerURI}/static/images/abs.jpg`
                            }}
                        />
                    </ImageBackground>
                    <ListItem icon>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name="plane" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>Airplane Mode</Text>
                        </Body>
                        <Right>
                            <Switch value={false} />
                        </Right>
                    </ListItem>
                    <ListItem icon onPress={this._signOutAsync}>
                        <Left>
                            <Button style={{ backgroundColor: "#FF9501" }}>
                                <Icon active name="ios-exit-outline" />
                            </Button>
                        </Left>
                        <Body>
                            <Text>خروج</Text>
                        </Body>
                    </ListItem>                                
                </Content>
            </Container>
        )
    }
}

class OtherScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
          Roboto: require('native-base/Fonts/Roboto.ttf'),
          Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf')
        });
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading)
            return <Expo.AppLoading />
        return (
            <Container>
                <Header>
                <Left/>
                    <Body>
                        <Title>Header</Title>
                    </Body>
                    <Right />                    
                </Header>
            </Container>
        )
    }
}


const AppDrawerNavigator = createDrawerNavigator({
    Tabs: Tabs,
    Other: OtherScreen,
  },{
      contentComponent: Profile,
      drawerBackgroundColor: "#fffdfb"
  })


const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop: getStatusBarHeight(),
    }
})

export default AppDrawerNavigator