import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { DISHES } from '../shared/dishes';


const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail }
  },
  {
    initialRouteName: 'Menu',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: "#fff"            
      }
    }
  }
);

const HomeNavigator = createStackNavigator({
    Home: { screen: Home }
  }, 
  {
    defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: {
        backgroundColor: "#512DA8"
    },
    headerTitleStyle: {
        color: "#fff"            
    },
    headerTintColor: "#fff"  
  })
});

const ContactNavigator = createStackNavigator({
  Contact: { screen: Contact }
}, 
{
  defaultNavigationOptions: ({ navigation }) => ({
  headerStyle: {
      backgroundColor: "#512DA8"
  },
  headerTitleStyle: {
      color: "#fff"            
  },
  headerTintColor: "#fff"  
})
});

const AboutNavigator = createStackNavigator({
  About: { screen: About }
}, 
{
  defaultNavigationOptions: ({ navigation }) => ({
  headerStyle: {
      backgroundColor: "#512DA8"
  },
  headerTitleStyle: {
      color: "#fff"            
  },
  headerTintColor: "#fff"  
})
});



const MainNavigator = createDrawerNavigator({
    Home: { 
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home'
      }
    },
    About: { 
      screen: AboutNavigator,
      navigationOptions: {
        title: 'About Us',
        drawerLabel: 'About Us'
      }
    },
    Menu: { 
      screen: MenuNavigator,
      navigationOptions: {
        title: 'Menu',
        drawerLabel: 'Menu'
      }, 
    },
    Contact: { 
      screen: ContactNavigator,
      navigationOptions: {
        title: 'Contact Us',
        drawerLabel: 'Contact Us'
      }
    }
  },
  {
    drawerBackgroundColor: '#D1C4E9'
  }
);


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES, 
      selectedDish: null 
    };
  }


  onDishSelect(dishId) {
    this.setState({selectedDish: dishId})
}

  render() {
    const App = createAppContainer(MainNavigator);

    return (
      <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
        <App />
      </View>
    );
  }
}
  
export default Main;