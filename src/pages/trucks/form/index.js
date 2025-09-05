import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import TruckForm from 'src/views/trucks/TruckForm'

const AddTruckPage = () => {
  const router = useRouter()
  const storedToken = typeof window !== 'undefined' && localStorage.getItem('token')

  const [companies, setCompanies] = useState([])
  const [managers, setManagers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [tripForms, setTripForms] = useState([])
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [companiesRes, usersRes] = await Promise.all([
  //         axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
  //           headers: { Authorization: `Bearer ${storedToken}` }
  //         }),
  //         axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
  //           headers: { Authorization: `Bearer ${storedToken}` }
  //         })
  //       ])

  //       setCompanies(companiesRes.data.data)
  //       const users = usersRes.data.data
  //       setManagers(users.filter(user => user.role === 'Manager'))
  //       setDrivers(users.filter(user => user.role === 'Driver'))
  //     } catch (err) {
  //       toast.error('Failed to load companies or users')
  //       console.error(err)
  //     }
  //   }

  //   fetchData()
  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        const users = userRes.data.data
        setManagers(users.filter(user => user.role === 'Manager'))
        setDrivers(users.filter(user => user.role === 'Driver'))

        if (!isRestricted) {
          const companyRes = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
          setCompanies(companyRes.data.data)
        }

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
  }, [isRestricted])

  const handleAddTruck = async formData => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/trucks`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Truck added successfully')
      router.push('/trucks')
    } catch (err) {
      toast.error('Failed to add truck')
      console.error(err)
    }
  }

  return (
    <TruckForm
      onSubmitForm={handleAddTruck}
      companies={companies}
      managers={managers}
      drivers={drivers}
      currentUser={user}
      isRestricted={isRestricted}
      tripForms={tripForms}
    />
  )
}

export default AddTruckPage

AddTruckPage.acl = {
  action: 'read',
  subject: 'trucks-add'
}
