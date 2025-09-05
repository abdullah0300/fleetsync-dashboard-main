// pages/companies/form/[companyId].js

import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CompanyForm from 'src/views/companies/CompanyForm'

const EditCompanyPage = () => {
  const router = useRouter()
  const { companyId } = router.query
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')
  const { setError, clearErrors } = useForm()

  useEffect(() => {
    if (!companyId) return

    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies/${companyId}`, {
          headers: { Authorization: `Bearer ${storedToken}` }
        })
        setCompanyData(res.data.data)
      } catch (error) {
        toast.error('Failed to load company')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  const handleSubmit = async formData => {
    try {
      clearErrors()
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies/${companyId}`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Company updated successfully')
      router.push('/companies')
    } catch (error) {
      toast.error('Failed to update company')
    }
  }

  if (loading) return <CircularProgress />

  return <CompanyForm companyData={companyData} onSubmitForm={handleSubmit} />
}

export default EditCompanyPage
