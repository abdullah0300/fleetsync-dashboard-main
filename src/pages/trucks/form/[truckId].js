import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import TruckForm from 'src/views/trucks/TruckForm'

const EditTruckPage = () => {
  const router = useRouter()
  const { truckId } = router.query
  const storedToken = typeof window !== 'undefined' && localStorage.getItem('token')

  const [truckData, setTruckData] = useState(null)
  const [companies, setCompanies] = useState([])
  const [managers, setManagers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [tripForms, setTripForms] = useState([])
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  // useEffect(() => {
  //   if (!truckId) return

  //   const fetchData = async () => {
  //     try {
  //       const [truckRes, companiesRes, usersRes] = await Promise.all([
  //         axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks/${truckId}`, {
  //           headers: { Authorization: `Bearer ${storedToken}` }
  //         }),
  //         axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
  //           headers: { Authorization: `Bearer ${storedToken}` }
  //         }),
  //         axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
  //           headers: { Authorization: `Bearer ${storedToken}` }
  //         })
  //       ])

  //       setTruckData(truckRes.data.data)
  //       setCompanies(companiesRes.data.data)
  //       const users = usersRes.data.data
  //       setManagers(users.filter(user => user.role === 'Manager'))
  //       setDrivers(users.filter(user => user.role === 'Driver'))
  //     } catch (err) {
  //       toast.error('Failed to load truck or dependencies')
  //       console.error(err)
  //     }
  //   }

  //   fetchData()
  // }, [truckId])

  useEffect(() => {
    if (!truckId) return

    const fetchData = async () => {
      try {
        const truckRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks/${truckId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        const usersRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })

        if (!isRestricted) {
          const companiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
          setCompanies(companiesRes.data.data)
        }

        setTruckData(truckRes?.data?.data)
        const users = usersRes.data.data
        setManagers(users.filter(user => user.role === 'Manager'))
        setDrivers(users.filter(user => user.role === 'Driver'))

        const tripFormRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripForms`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        setTripForms(tripFormRes.data.data)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load user or companies')
      }
    }

    fetchData()
  }, [isRestricted, truckId])

  const handleUpdateTruck = async formData => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks/${truckId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Truck updated successfully')
      router.push('/trucks')
    } catch (err) {
      toast.error('Failed to update truck')
      console.error(err)
    }
  }

  return (
    truckData && (
      <TruckForm
        truckData={truckData}
        onSubmitForm={handleUpdateTruck}
        companies={companies}
        managers={managers}
        drivers={drivers}
        currentUser={user}
        isRestricted={isRestricted}
        tripForms={tripForms}
      />
    )
  )
}

export default EditTruckPage

EditTruckPage.acl = {
  action: 'read',
  subject: 'trucks-edit'
}
