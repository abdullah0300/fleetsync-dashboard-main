// pages/tripForms/form/add.js
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import TripFormForm from 'src/views/tripForm/TripFormForm'

const AddTripForm = () => {
  const router = useRouter()
  const [managers, setManagers] = useState([])
  const storedToken = typeof window !== 'undefined' && localStorage.getItem('token')
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users?role=Manager`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => setManagers(res.data.data.filter(user => user.role === 'Manager')))
      .catch(() => toast.error('Failed to load managers'))
  }, [])

  const handleSubmit = async formData => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripForms`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Form created')
      router.push('/tripForms')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create form')
    }
  }

  return <TripFormForm managers={managers} onSubmitForm={handleSubmit} currentUser={user} isRestricted={isRestricted} />
}

export default AddTripForm

AddTripForm.acl = {
  action: 'read',
  subject: 'trip-forms-add'
}
