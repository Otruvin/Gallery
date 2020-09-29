import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom'
import {useRoutes} from "./routes";
import {isAuthenticated} from "./apollo/cache";

function App() {
    const routes = useRoutes(isAuthenticated())
  return (
    <Router>
        <div className="App">
            {routes}
        </div>
    </Router>
  );
}

export default App;
