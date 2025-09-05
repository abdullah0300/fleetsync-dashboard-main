// pages/users/form/add.js

import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import UserForm from 'src/views/users/UserForm'

const AddUserPage = () => {
  const router = useRouter()
  const [companies, setCompanies] = useState([])
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')
  const { setError, clearErrors } = useForm()
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  // Fetch companies
  useEffect(() => {
    if (!isRestricted) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        .then(res => setCompanies(res.data.data))
        .catch(() => toast.error('Failed to load companies'))
    }
  }, [])

  const handleSubmit = async formData => {
    try {
      clearErrors()
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/register`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('User created successfully')

      // router.push('/users')
      // If role is Driver and we're creating a new user, redirect to driver form
      if (formData.role === 'Driver') {
        router.push('/drivers/form')
      }
    } catch (error) {
      const message = error.response?.data?.message || ''
      if (message.includes('validation failed')) {
        if (message.includes('email')) {
          setError('email', { type: 'manual', message: 'Invalid or duplicate email address' })
        }
        if (message.includes('role')) {
          setError('role', { type: 'manual', message: 'Invalid role. Must be SuperAdmin, Manager, or Driver' })
        }
        if (message.includes('companyId')) {
          setError('companyId', { type: 'manual', message: 'Invalid company' })
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

  return <UserForm onSubmitForm={handleSubmit} companies={companies} currentUser={user} isRestricted={isRestricted} />
}

export default AddUserPage

AddUserPage.acl = {
  action: 'read',
  subject: 'users-add'
}
