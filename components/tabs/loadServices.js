import React,{Component} from 'react'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity,SafeAreaView,StatusBar ,ImageBackground} from 'react-native'
import axios from 'axios'
import {ListItem} from 'react-native-elements'
import GridView from 'react-native-super-grid'
import config from '../../config';

class LoadServices extends Component {
    constructor(props) {
        super(props)

        let {tree} = this.props.navigation.state.params || this.props.screenProps || []
        let {parent} = this.props.navigation.state.params || 0

        this.state = {
            tree : tree,
            leafs : []
        }

        if (parent>0)
            axios.get(`${config.ServerURI}/api/service/${parent}`)
            .then(res=>{
                this.setState({
                    leafs : res.data
                })
            })
    }
    TraverseNextTier(node) {
        let breadCrump = this.props.navigation.getParam('breadCrump','')
        this.props.navigation.push('LoadServices',{
            tree : node.children || [],
            parent : node.id,
            breadCrump : (breadCrump) ? `${breadCrump}/${node.title}` : `${node.title}`
        })
    }

    renderLeafs() {
        return(
            <GridView
                itemDimension={80}
                items={this.state.leafs}
                style={styles.gridView}
                renderItem={service => (
                <View style={[styles.itemContainer]}>
                <TouchableOpacity style={styles.itemContainer}
                onPress={() => this.props.navigation.navigate('TaskWizard', {
                    service : service,
                })}
                >
                    <ImageBackground
                    source={{ uri : (service.icons && service.icons.length>0) ? `${config.ServerURI}/api/service/${service.id}/icons/${service.icons[0]}` : "http://"}}
                    style={styles.gridContainer}
                    >
                    <Text style={styles.itemName}>{service.title}</Text>
                    </ImageBackground>
                </TouchableOpacity>
                </View>
                )}
            />
        )
    }

    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state
        let headerTitle = params.breadCrump || 'انتخاب سرویس'
        let headerTitleStyle = { fontWeight : 'normal', fontSize : 13}
        return {headerTitle ,headerTitleStyle}
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content"/>
                <View style={styles.container}>
                    <ScrollView>
                    {
                        this.state.tree.map((node, index)=>{
                            return  <ListItem
                                        key={index}
                                        title={node.title}
                                        avatar = {{uri : `${config.ServerURI}/api/category/${node.id}/icons/${node.icons[0]}`}}
                                        avatarStyle={{borderRadius:50, backgroundColor : '#fff'}}
                                        onPress={()=>this.TraverseNextTier(node)}
                                    />
                        })
                    }
                    {this.renderLeafs()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container :{
        flex : 1,
        backgroundColor : '#fff'
    },
    gridContainer: {
      flex: 1,
      backgroundColor : '#fff',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
    },
    gridView: {
      paddingTop: 25,
      flex: 1,
    },
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 5,
      padding: 10,
      height: 80,
    },
    itemName: {
      fontSize: 18,
      color: '#2e003e',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },    
})


export default LoadServices