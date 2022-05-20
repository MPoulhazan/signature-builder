import React, { Component } from 'react';
import './App.scss';
import Home from './pages/Home';
import { Switch, Route, Router } from 'react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="title">SIGNER BUILDER</h1>
                    <Router history={history}>
                        <Switch>
                            <Route exact path="/" component={Home} />
                        </Switch>
                    </Router>
                </header>
            </div>
        );
    }
}

export default App;
