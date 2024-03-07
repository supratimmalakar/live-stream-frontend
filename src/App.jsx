import { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/slice';
import { Switch, Route } from 'react-router-dom';
import { routes } from './routes';

function App() {
  const dispatch = useDispatch();
  const {socket} = useSelector((state) => state.stream)

  useEffect(() => {
    const socket = io("http://localhost:8080", { path: "/socket" });
    dispatch(setSocket(socket))
  }, [])

  return (
    <Switch>
      {routes.map((route, index) => (
        <Route key={index} component={route.component} exact={route.exact} path={route.path} />
      ))}
    </Switch>
  )
}

export default App
