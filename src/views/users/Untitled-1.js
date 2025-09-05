const handleSubmitForm = async formData => {
  try {
    clearErrors()

    if (userId) {
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
    } else {
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/register`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
    }

    toast.success('User saved successfully')
    router.push('/users')
  } catch (error) {
    console.error('Submit failed:', error)

    // Handle validation errors
    if (error.response?.data?.message?.includes('validation failed')) {
      const { message } = error.response.data

      if (message.includes('email')) {
        setError('email', { type: 'manual', message: 'Invalid or duplicate email address' })
      }
      if (message.includes('role')) {
        setError('role', { type: 'manual', message: 'Invalid role. Must be SuperAdmin, Manager, or Driver' })
      }
      if (message.includes('companyId')) {
        setError('companyId', {
          type: 'manual',
          message: 'Invalid company. Please select a valid company'
        })
      }
      if (message.includes('password')) {
        setError('password', { type: 'manual', message: 'Password does not meet requirements' })
      }

      toast.error('Validation failed. Please fix errors.')
    } else {
      toast.error('Something went wrong')
    }
  }
}
