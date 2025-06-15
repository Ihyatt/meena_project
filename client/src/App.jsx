import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Campaign from "./pages/Campaign";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";


const router = createBrowserRouter([
  {
    path: '/',
    element: <Campaign />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/campaigns/:campaignId/checkout',
    element: <Checkout />,
  },
]);


function App() {

  return <RouterProvider router={router} />;
}

export default App;

