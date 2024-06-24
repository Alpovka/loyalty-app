'use client'

import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  surname: Yup.string().required('Surname is required'),
  birthday: Yup.date().required('Birthday is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
})

const AddCustomerForm = () => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) // 'success' or 'error'

  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const response = await fetch('/api/customers/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(
          data.reward
            ? `Customer added successfully. Reward: ${data.reward}`
            : 'Customer added successfully'
        )
        setMessageType('success')
        resetForm()
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.message || 'Failed to add customer' })
        setMessage(errorData.message || 'Failed to add customer')
        setMessageType('error')
      }
    } catch (error) {
      setErrors({ submit: 'Failed to add customer' })
      setMessage('Failed to add customer')
      setMessageType('error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFocus = () => {
    setMessage(null)
    setMessageType(null)
  }

  const fields = [
    { name: 'name', type: 'text', placeholder: 'John', label: 'Name' },
    { name: 'surname', type: 'text', placeholder: 'Doe', label: 'Surname' },
    {
      name: 'birthday',
      type: 'date',
      placeholder: '1990-01-01',
      label: 'Birthday'
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'john.doe@example.com',
      label: 'Email'
    }
  ]

  return (
    <div className="bg-white py-6 px-8 rounded-lg shadow-lg">
      <Formik
        initialValues={{ name: '', surname: '', birthday: '', email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-fadeIn">
              Add Customer
            </h2>
            {fields.map((field) => (
              <div key={field.name} className="relative mb-6">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor={field.name}
                >
                  {field.label}
                </label>
                <Field
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out"
                  onFocus={handleFocus}
                />
                <ErrorMessage
                  name={field.name}
                  component="div"
                  className="text-red-500 text-sm mt-1 absolute animate-slideIn"
                />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Add Customer'}
              </button>
            </div>
            {message && (
              <div
                className={`mt-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'} text-sm animate-fadeIn`}
              >
                {message}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddCustomerForm
