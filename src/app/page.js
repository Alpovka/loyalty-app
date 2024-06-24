import React from 'react';
import AddCustomerForm from './components/AddCustomerForm';
import PurchaseForm from './components/PurchaseForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Smoothie Shop Loyalty Program</h1>
        <p className="text-gray-600">Enjoy free smoothie on your birthday and 8th purchase!</p>
      </header>
      <main className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <AddCustomerForm />
          <PurchaseForm />
        </div>
      </main>
    </div>
  );
}
