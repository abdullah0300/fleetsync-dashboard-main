// pages/drivers/form/[driverId].js

import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import DriverForm from 'src/views/drivers/DriverForm'

const EditDriverPage = () => {
  const router = useRouter()
  const { driverId } = router.query
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')

  const [driverData, setDriverData] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [managers, setManagers] = useState([])
  const [trucks, setTrucks] = useState([])
  const [tripForms, setTripForms] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  useEffect(() => {
    if (!driverId) return

    const fetchData = async () => {
      try {
        const [driverRes, usersRes, trucksRes, tripFormsRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/drivers/${driverId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          }),
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
        setDriverData(driverRes.data.data)
        setDrivers(users.filter(u => u.role === 'Driver'))
        setManagers(users.filter(u => u.role === 'Manager'))
        setTrucks(trucksRes.data.data)
        setTripForms(tripFormsRes.data.data)
      } catch (error) {
        toast.error('Failed to load data')
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [driverId])

  const handleSubmit = async formData => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/drivers/${driverId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Driver updated successfully')
      router.push('/drivers')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <CircularProgress />

  return (
    <DriverForm
      driverData={driverData}
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

export default EditDriverPage

EditDriverPage.acl = {
  action: 'read',
  subject: 'drivers-edit'
}
