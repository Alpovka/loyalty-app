import React from 'react';
import AddCustomerForm from './components/AddCustomerForm';
import PurchaseForm from './components/PurchaseForm';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <AddCustomerForm />
      <PurchaseForm />
    </div>
  );
}
