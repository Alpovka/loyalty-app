'use client'

import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const purchaseValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
})

const PurchaseForm = () => {
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) // 'success' or 'error'

  const handlePurchase = async (
    values,
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const response = await fetch('/api/customers/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(
          data.reward
            ? 'Reward granted: ' + data.reward
            : 'Purchase recorded successfully'
        )
        setMessageType('success')
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.message || 'Customer not found' })
        setMessage(errorData.message || 'Customer not found')
        setMessageType('error')
      }
    } catch (error) {
      setErrors({ submit: 'Failed to record purchase' })
      setMessage('Failed to record purchase')
      setMessageType('error')
    } finally {
      setSubmitting(false)
      resetForm()
    }
  }

  const handleFocus = () => {
    setMessage(null)
    setMessageType(null)
  }

  const fields = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'john.doe@example.com',
      label: 'Customer Email'
    }
  ]

  return (
    <div className="bg-white py-6 px-8 rounded-lg shadow-lg">
      <Formik
        initialValues={{ email: '' }}
        validationSchema={purchaseValidationSchema}
        onSubmit={handlePurchase}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 animate-fadeIn">
              Record Purchase
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
            {errors.submit && (
              <div className="text-red-500 text-sm mb-4">{errors.submit}</div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transform transition-all duration-300 ease-in-out"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Record Purchase'}
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

export default PurchaseForm
