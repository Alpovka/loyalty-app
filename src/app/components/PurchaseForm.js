"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const purchaseValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const PurchaseForm = () => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null); // 'success' or 'error'

    const handlePurchase = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            const response = await fetch('/api/customers/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.reward ? 'Reward granted: ' + data.reward : 'Purchase recorded successfully');
                setMessageType('success');
            } else {
                const errorData = await response.json();
                setErrors({ submit: errorData.message || 'Customer not found' });
                setMessage(errorData.message || 'Customer not found');
                setMessageType('error');
            }
        } catch (error) {
            setErrors({ submit: 'Failed to record purchase' });
            setMessage('Failed to record purchase');
            setMessageType('error');
        } finally {
            setSubmitting(false);
            resetForm();
        }
    };

    const handleFocus = () => {
        setMessage(null);
        setMessageType(null);
    };

    return (
        <div>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={purchaseValidationSchema}
                onSubmit={handlePurchase}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-gray-700 text-lg font-bold mb-4">Record Purchase</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Customer Email
                            </label>
                            <Field
                                name="email"
                                type="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onFocus={handleFocus}
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2" />
                        </div>
                        {errors.submit && <div className="text-red-500 text-xs mb-4">{errors.submit}</div>}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Record Purchase'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            {message && (
                <div
                    className={`${messageType === 'success' ? 'text-green-500' : 'text-red-500'
                        } text-xs mt-4`}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default PurchaseForm;
