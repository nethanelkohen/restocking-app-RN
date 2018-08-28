import React, { Component } from 'react';
import { TouchableOpacity, Keyboard, StyleSheet } from 'react-native';
import {
  Container,
  View,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Body,
  Title,
  Item,
  Input,
  Right,
  Icon,
  Button
} from 'native-base';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null,
      amount: null,
      items: [],
      stockedItems: []
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => this.getData(), 1000);
  }

  async getData() {
    return fetch('http://127.0.0.1:8000/api/items')
      .then(response => response.json())
      .then(resJson => {
        this.setState(
          {
            items: resJson.items,
            stockedItems: resJson.s_items
          },
          function() {
            //comment
          }
        );
      })
      .catch(error => {
        null;
      });
  }

  addItem = () => {
    fetch('http://127.0.0.1:8000/api/item', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        item: this.state.item,
        stocked: false,
        amount: this.state.amount
      })
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('responseData', responseData);
        'POST Response', 'Response Body -> ' + JSON.stringify(responseData);
      })
      .done();
    Keyboard.dismiss();
  };

  stockItem = id => {
    fetch(`http://127.0.0.1:8000/api/item/${id}/complete`).done();
  };

  deleteItem = id => {
    fetch(`http://127.0.0.1:8000/api/item/${id}/delete`).done();
  };

  render() {
    let { stockedItems, items } = this.state;
    return (
      <Container>
        <Header
          androidStatusBarColor="#1362af"
          style={{ backgroundColor: '#1976D2' }}
        >
          <Body style={styles.body}>
            <Title>Restocking App</Title>
          </Body>
        </Header>
        <Content style={styles.content}>
          <Item rounded style={{ marginBottom: 20, marginTop: 20 }}>
            <Input
              placeholder="Add Item"
              onChangeText={input => this.setState({ item: input })}
              ref={ref => {
                this.input = ref;
              }}
            />
          </Item>
          <Item rounded style={{ marginBottom: 20 }}>
            <Input
              placeholder="Add amount"
              onChangeText={input => this.setState({ amount: input })}
              ref={ref => {
                this.input = ref;
              }}
            />
          </Item>
          <Button
            block
            light
            onPress={() => this.addItem()}
            style={{ marginLeft: 30, marginRight: 30 }}
          >
            <Text>Add</Text>
          </Button>
          <View style={styles.container}>
            <Text style={styles.text}>OUT OF STOCK</Text>
          </View>
          <List
            dataArray={!items ? {} : items}
            renderRow={item => (
              <ListItem style={{ marginTop: 5 }}>
                <Left>
                  <Text style={styles.listitemtext}>
                    {item.item} amount:
                    {item.amount}
                  </Text>
                </Left>
                <Right>
                  <TouchableOpacity
                    onPress={() => {
                      this.stockItem(item.id);
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  >
                    <Icon
                      name="ios-checkmark"
                      style={{ fontSize: 30, color: '#41f444' }}
                    />
                  </TouchableOpacity>
                </Right>
              </ListItem>
            )}
          />
          <View style={styles.container}>
            <Text style={styles.text}>IN STOCK</Text>
          </View>
          <List
            dataArray={!stockedItems ? {} : stockedItems}
            renderRow={item => (
              <ListItem style={{ marginTop: 5 }}>
                <Left>
                  <Text style={styles.listitemtext}>{item.item}</Text>
                  <Text style={styles.listitemtext}>
                    {' '}
                    amount: {item.amount}
                  </Text>
                </Left>
                <Right>
                  <TouchableOpacity
                    onPress={() => {
                      this.deleteItem(item.id);
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
                  >
                    <Icon
                      name="ios-close"
                      style={{ fontSize: 30, color: '#e01414' }}
                    />
                  </TouchableOpacity>
                </Right>
              </ListItem>
            )}
          />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  content: {
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d7dadd'
  },
  listitemtext: {
    fontSize: 17,
    color: '#5b5757'
  }
});

export default App;
