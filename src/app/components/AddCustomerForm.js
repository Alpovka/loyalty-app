"use client";

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    surname: Yup.string().required('Surname is required'),
    birthday: Yup.date().required('Birthday is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const AddCustomerForm = () => {
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null); // 'success' or 'error'

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
            const response = await fetch('/api/customers/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.reward ? `Customer added successfully. Reward: ${data.reward}` : 'Customer added successfully');
                setMessageType('success');
                resetForm();
            } else {
                const errorData = await response.json();
                setErrors({ submit: errorData.message || 'Failed to add customer' });
                setMessage(errorData.message || 'Failed to add customer');
                setMessageType('error');
            }
        } catch (error) {
            setErrors({ submit: 'Failed to add customer' });
            setMessage('Failed to add customer');
            setMessageType('error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFocus = () => {
        setMessage(null);
        setMessageType(null);
    };

    return (
        <div>
            <Formik
                initialValues={{ name: '', surname: '', birthday: '', email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors }) => (
                    <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-gray-700 text-lg font-bold mb-4">Add Customer</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <Field
                                name="name"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onFocus={handleFocus}
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-2" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="surname">
                                Surname
                            </label>
                            <Field
                                name="surname"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onFocus={handleFocus}
                            />
                            <ErrorMessage name="surname" component="div" className="text-red-500 text-xs mt-2" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthday">
                                Birthday
                            </label>
                            <Field
                                name="birthday"
                                type="date"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onFocus={handleFocus}
                            />
                            <ErrorMessage name="birthday" component="div" className="text-red-500 text-xs mt-2" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <Field
                                name="email"
                                type="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onFocus={handleFocus}
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2" />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Add Customer'}
                            </button>
                        </div>
                        {message && (
                            <div
                                className={`${messageType === 'success' ? 'text-green-500' : 'text-red-500'
                                    } text-xs mt-4`}
                            >
                                {message}
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddCustomerForm;
