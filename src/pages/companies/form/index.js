// pages/companies/form/add.js

import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CompanyForm from 'src/views/companies/CompanyForm'

const AddCompanyPage = () => {
  const router = useRouter()
  const storedToken = typeof window !== 'undefined' && window.localStorage.getItem('token')
  const { setError, clearErrors } = useForm()

  const handleSubmit = async formData => {
    try {
      clearErrors()
      await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/companies`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      toast.success('Company created successfully')
      router.push('/companies')
    } catch (error) {
      toast.error('Failed to create company')
    }
  }

  return <CompanyForm onSubmitForm={handleSubmit} />
}

export default AddCompanyPage
