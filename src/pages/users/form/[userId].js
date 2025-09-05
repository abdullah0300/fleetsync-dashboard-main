// pages/users/form/[userId].js

import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import UserForm from 'src/views/users/UserForm'

const EditUserPage = () => {
  const router = useRouter()
  const { userId } = router.query
  const [userData, setUserData] = useState(null)

  // const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')
  const { setError, clearErrors } = useForm()
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  // Fetch user and companies
  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        // Always fetch the user data
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        setUserData(userRes.data)

        // Conditionally fetch companies only if NOT restricted
        if (!isRestricted) {
          const companyRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
          setCompanies(companyRes.data.data)
        }
      } catch (error) {
        console.log(error)
        toast.error('Failed to load user or companies')
      }

      // finally {
      //   setLoading(false)
      // }
    }

    fetchData()
  }, [userId, isRestricted])

  const handleSubmit = async formData => {
    try {
      clearErrors()
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('User updated successfully')
      router.push('/users')
    } catch (error) {
      const message = error.response?.data?.message || ''
      if (message.includes('validation failed')) {
        if (message.includes('email')) {
          setError('email', { type: 'manual', message: 'Invalid or duplicate email address' })
        }
        if (message.includes('role')) {
          setError('role', { type: 'manual', message: 'Invalid role' })
        }
        if (message.includes('companyId')) {
          setError('companyId', { type: 'manual', message: 'Invalid company' })
        }
        if (message.includes('password')) {
          setError('password', { type: 'manual', message: 'Password does not meet requirements' })
        }
        toast.error('Validation failed')
      } else {
        toast.error('Something went wrong')
      }
    }
  }

  // if (loading) return <CircularProgress />

  return (
    <UserForm
      userData={userData}
      onSubmitForm={handleSubmit}
      companies={companies}
      currentUser={user}
      isRestricted={isRestricted}
    />
  )
}

export default EditUserPage

EditUserPage.acl = {
  action: 'read',
  subject: 'users-edit'
}
