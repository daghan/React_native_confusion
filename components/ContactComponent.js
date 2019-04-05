import React, { Component } from 'react';
import { View, Text, ScrollView} from 'react-native';
import { Card } from 'react-native-elements';



class Contact extends Component {

    constructor(props) {
        super(props);
    }


    static navigationOptions = {
        title: 'Contact Us'
    };

    render() {
        return(
            <Card title="Daghan" >
                <Text
                    style={{margin: 10}}>
                    lorel ipsum</Text>
            </Card>
            
        );
    }
}

export default Contact;