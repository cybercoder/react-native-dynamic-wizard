import React, {Component} from 'react'
import { View, StyleSheet,ActivityIndicator,AsyncStorage,StatusBar} from 'react-native'

class TokenCheck extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }
    
      // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      };
    
      // Render any loading content that you like here
      render() {
        return (
          <View style={styles.container}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
          </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
})

export default TokenCheck