import React from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageURLForm from "./components//ImageURLForm/ImageURLForm";
import Rank from "./components/Rank/Rank";
import Particles from 'react-particles-js';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition"
import SignIn from "./components/SignIn/SignIn"
import Register from "./components/Register/Register"

const particleParams = {
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      value: "#fff"
    },
    opacity: {
      value: 1,
      random: false,
      anim: {
        enable: false,
        speed: 5,
        opacity_min: 1,
        sync: false
      }
    },
  }
}


const particleStyle = {
  position: "fixed",
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  zIndex: "-1" 
}

const initialState = {
  userQuery: "",
  input: "",
  boundingBox: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    entries: "",
    joined: ""
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: data})
  }

  onRouteChange = (newRoute) => {
    if (newRoute === "signout") {
      this.setState(initialState);
    }
    else if (newRoute === "home") {
      this.setState({isSignedIn: true});
    }
    this.setState({route: newRoute})
  }

  calculateFaces = (data) => {
    const faceArray = [];
    const image = document.getElementById("inputImage");  //used to calculate width and height
    const height = Number(image.height)
    const width = Number(image.width)
    for (let i =0; i < data.outputs[0].data.regions.length; i++) {
      let clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;
      console.log(clarifaiFace);
      clarifaiFace.left_col = clarifaiFace.left_col * width;
      clarifaiFace.right_col = width - (clarifaiFace.right_col * width);
      clarifaiFace.top_row = clarifaiFace.top_row * height;
      clarifaiFace.bottom_row = height-(clarifaiFace.bottom_row*height);
      faceArray.push(clarifaiFace)
    }
    return faceArray;
  }

  displayFaces = (boundingBox) => {
    this.setState({boundingBox: boundingBox})
  }

  onInputHandler = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonHandler = () => {
    this.setState({userQuery: this.state.input})
    fetch("http://localhost:3010/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch("http://localhost:3010/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(data => {
            this.setState(Object.assign(this.state.user, {entries: data}))
          })
        }
        this.displayFaces(this.calculateFaces(response))
      })
      .catch(err => console.log(err))
  }

  render() {
    const {name, entries} = this.state.user;
    return (
      <div className="App">
        <Particles params={particleParams} style={particleStyle}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        {this.state.route === "home"
          ? <div>
              <Logo/>
              <Rank name={name} entries={entries}/>
              <ImageURLForm 
                onButtonHandler={this.onButtonHandler}
                onInputHandler={this.onInputHandler}/>
              <FaceRecognition boundingBox={this.state.boundingBox} imageURL={this.state.userQuery}/>
            </div>
          : (this.state.route === "signin" 
            ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>)
        } 
        </div>
    )
  }
}

export default App;
