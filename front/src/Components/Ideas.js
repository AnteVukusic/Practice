import React, { Component } from "react";

class Ideas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      users: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/ideas/getideas")
      .then(res => res.json())
      .then(items => {
        this.setState({
          isLoaded: true,
          items: items
        });
        items.map(item => {
          fetch(`http://localhost:5000/api/users/${item.user}`)
            .then(res => res.json())
            .then(childitem => {
              console.log(childitem);
              return this.state.users.push({ childitem });
            });
          return null;
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    let { isLoaded, items, users } = this.state;

    if (!isLoaded) {
      return <div>Loading..</div>;
    } else {
      return (
        <div className="Ideas">
          <div className="container">
            <ul>
              {items.map(item => (
                <li key={item._id}>
                  <a>{item.title}</a>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }
}

export default Ideas;
