import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import PaymentSuccess from 'src/pages/donor/payment/components/PaymentSuccess'
import PaymentFailed from 'src/pages/donor/payment/components/PaymentFailed'
import Loading from 'src/components/Loading'
import useDonorStore from 'src/stores/Donor';




const CheckoutComplete = () => {
  const { fetchCheckout, isLoading, status } = useDonorStore();

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    fetchCheckout(sessionId)

  }, [fetchCheckout]);


  { isLoading && <Loading /> }
  if (status == 'paid') {
    return <PaymentSuccess />
  } else if (status === 'failed') {
    <PaymentFailed />
  }

  return <div>Something went wrong.</div>;
};

export default CheckoutComplete;