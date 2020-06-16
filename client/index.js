import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { delay } from './utils/index';

const APP_STARTUP_TIME = 'app_startup_time';

console.time(APP_STARTUP_TIME);

const { API_URL } = process.env;

// TODO: I can't stress enough, you can delete everything in this component. None of it matters. Its just meant to be an example of writing react inside of here. You can add more files with more components, and import them into this one.
class App extends Component {
  state = { 
    loaded: null,
    users: [] 
  };

  componentDidMount() {
    // Creates a race between a 5 second timeout and a call to the API. Allows us to detect the call hanging.
    Promise.race([this.checkHealth(), delay(5000, true)])
      .then(() => {
        this.setState({
          loaded: true,
        });
      })
      .catch((e) => {
        if (e instanceof Error) {
          console.error(
            'Timeout/Failure while connecting to API. Are you SURE you started the API? Try opening a separate terminal session and running "npm run start:server"'
          );
        }

        this.setState({
          loaded: false,
        });
      });
    
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          users: data,
        })
        console.log(this.state);
      });
  }

  // Getter to simplify the logic inside of render.
  get loadedState() {
    const { loaded } = this.state;
    if (loaded === null) {
      return {
        color: 'gray',
        message: 'Connecting to API',
      };
    }

    return {
      color: loaded ? 'green' : 'red',
      message: loaded ? 'Connected!' : 'Failed to connect!',
    };
  }

  // Call to the API.
  checkHealth = () => {
    return fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then(() => {
        return true;
      })
      .catch((e) => {
        console.error(`Failed to load initial health check.`, e);
        throw e;
      });
  };

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100vw',
                alignItems: 'center',
                fontFamily: 'Roboto',
              }}
            >
              <img
                alt="Beaver"
                style={{
                  height: '250px',
                }}
                src="https://pbs.twimg.com/profile_images/2779323089/f1d2488fedff90047a32244dbc624e59_400x400.jpeg"
              />
              <h2>Beaver</h2>
              <span
                style={{
                  color: this.loadedState.color,
                  fontSize: '0.8em',
                }}
              >
                {this.loadedState.message}
              </span>
            </div>
          </Route>
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'), () => {
  console.timeEnd(APP_STARTUP_TIME);
});
