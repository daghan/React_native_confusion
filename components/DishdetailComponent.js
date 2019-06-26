import {
  Text,
  View,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  Button,
  Alert,
  PanResponder,
  Share
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import React, { Component } from "react";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment))
});

function RenderDish(props) {
  const dish = props.dish;

  handleViewRef = ref => (this.view = ref);

  const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    },{
        dialogTitle: 'Share ' + title
    })
  }

  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
    console.log(moveX, moveY, dx, dy);
    if (dx < -50) return true;
    else return false;
  };

  const recognizeComment = ({ moveX, moveY, dx, dy }) => {
    console.log(moveX, moveY, dx, dy);
    if (dx > 50) return true;
    else return false;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => {
      console.log("starting panResponder");
      return true;
    },
    onPanResponderEnd: (e, gestureState) => {
      console.log("pan responder end", gestureState);
      if (recognizeDrag(gestureState))
        Alert.alert(
          "Add Favorite",
          "Are you sure you wish to add " + dish.name + " to favorite?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress();
              }
            }
          ],
          { cancelable: false }
        );
      else if (recognizeComment(gestureState)) props.onCommentSwipe();
      return true;
    },
    onPanResponderGrant: () => {
      this.view
        .rubberBand(1000)
        .then(endState =>
          console.log(endState.finished ? "finished" : "cancelled")
        );
    }
  });

  if (dish != null) {
    return (
      <Animatable.View
        animation="fadeInDown"
        duration={2000}
        delay={1000}
        ref={this.handleViewRef}
        {...panResponder.panHandlers}
      >
        <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
            <Icon
              raised
              reverse
              name={props.favorite ? "heart" : "heart-o"}
              type="font-awesome"
              color="#f50"
              onPress={() =>
                props.favorite
                  ? console.log("Already favorite")
                  : props.onPress()
              }
            />
            <Icon
              raised
              reverse
              name={"pencil"}
              style={{ padding: "10%", alignSelf: "center" }}
              type="font-awesome"
              color="#512DA8"
              onPress={() => props.onPencilPress()}
            />
            <Icon
              raised
              reverse
              name="share"
              type="font-awesome"
              color="#51D2A8"
              style={styles.cardItem}
              onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image) }
            />
          </View>
        </Card>
      </Animatable.View>
    );
  } else {
    return <View />;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating
          imageSize={12}
          readonly
          startingValue={item.rating}
          style={styles.rating}
        />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
      <Card title="Comments">
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => item.id.toString()}
        />
      </Card>
    </Animatable.View>
  );
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dishId: null,
      rating: 5,
      author: "",
      comment: "",
      showModal: false
    };
  }

  static navigationOptions = {
    title: "Dish Details"
  };

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  toggleModal(dishId) {
    this.setState({
      dishId: dishId,
      showModal: !this.state.showModal
    });
  }

  ratingCompleted(rating) {
    this.setState({ rating: rating });
  }

  handleComment(dishId) {
    this.props.postComment(
      this.state.dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    this.toggleModal(this.state.dishID);
    this.resetForm();
  }

  resetForm() {
    this.setState({
      dishId: null,
      rating: 5,
      author: "",
      comment: "",
      showModal: false
    });
  }

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              startingValue={this.state.rating}
              onFinishRating={rating => this.ratingCompleted(rating)}
              style={{ paddingVertical: 10 }}
            />
            <Input
              // style = {styles.modalText}
              placeholder="Author"
              onChangeText={author => this.setState({ author })}
              leftIcon={{ type: "font-awesome", name: "user-o" }}
              leftIconContainerStyle={styles.leftIconContainerStyle}
            />
            <Input
              style={styles.modalText}
              placeholder="Comment"
              onChangeText={comment => this.setState({ comment })}
              leftIcon={{ type: "font-awesome", name: "comment-o" }}
              leftIconContainerStyle={styles.leftIconContainerStyle}
            />
            <Button
              raised
              containerStyle={{ marginVertical: 10 }}
              buttonStyle={{ backgroundColor: "#512DA8" }}
              onPress={() => {
                this.handleComment();
              }}
              title="SUBMIT"
            />
            <Button
              raised
              containerStyle={{ marginVertical: 10 }}
              buttonStyle={{ backgroundColor: "#a9a9a9" }}
              onPress={() => {
                this.toggleModal();
                this.resetForm();
              }}
              title="CANCEL"
            />
          </View>
        </Modal>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onPencilPress={() => this.toggleModal(dishId)}
          onCommentSwipe={() => this.toggleModal(dishId)}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  formLabel: {
    fontSize: 18,
    flex: 2
  },
  formItem: {
    flex: 1
  },
  modal: {
    justifyContent: "center",
    margin: 20
  },
  modalText: {
    fontSize: 18
  },
  rating: {
    alignSelf: "flex-start"
  },
  leftIconContainerStyle: {
    marginLeft: 0,
    marginRight: 10
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dishdetail);
