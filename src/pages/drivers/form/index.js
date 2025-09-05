// pages/drivers/form/add.js

import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import DriverForm from 'src/views/drivers/DriverForm'

const AddDriverPage = () => {
  const router = useRouter()
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')
  const [managers, setManagers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trucks, setTrucks] = useState([])
  const [tripForms, setTripForms] = useState([])
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, trucksRes, tripFormsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          }),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks?sortBy=createdAt&sortOrder=desc&isActive=true`,
            {
              headers: { Authorization: `Bearer ${storedToken}` }
            }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripforms?sortBy=createdAt&sortOrder=desc&isActive=true`,
            {
              headers: { Authorization: `Bearer ${storedToken}` }
            }
          )
        ])

        const users = usersRes.data.data
        setDrivers(users.filter(u => u.role === 'Driver'))
        setManagers(users.filter(u => u.role === 'Manager'))
        setTrucks(trucksRes.data.data)
        setTripForms(tripFormsRes.data.data)
      } catch (error) {
        toast.error('Failed to load required data')
        console.error('Error loading data:', error)
      }
    }

    fetchAllData()
  }, [])

  const handleSubmit = async formData => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/drivers`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Driver added successfully')
      router.push('/drivers')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add driver')
    }
  }

  return (
    <DriverForm
      onSubmitForm={handleSubmit}
      drivers={drivers}
      managers={managers}
      trucks={trucks}
      tripForms={tripForms}
      currentUser={user}
      isRestricted={isRestricted}
    />
  )
}

export default AddDriverPage

AddDriverPage.acl = {
  action: 'read',
  subject: 'drivers-add'
}
