import * as React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Campaign from "./pages/Campaign";
import Checkout from "./pages/Checkout";
// import  useCampaignStore  from './stores/Campaign'


const backednUrl = import.meta.env.VITE_BACKEND_API_URL;

const fetchCampaign = async () => {
  const response = await fetch(`${backednUrl}`);
  return await response.json();
};
// const { campaignId } = useCampaignStore();
const router = createBrowserRouter([
  {
    path: '/',
    element: <Campaign />,
    loader: fetchCampaign,
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

