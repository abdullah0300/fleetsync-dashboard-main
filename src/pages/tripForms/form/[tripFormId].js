// pages/tripForms/form/[formId].js
import axios from 'axios'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import TripFormForm from 'src/views/tripForm/TripFormForm'

const EditTripForm = () => {
  const router = useRouter()
  const { tripFormId } = router.query
  const [managers, setManagers] = useState([])
  const [formData, setFormData] = useState(null)
  const storedToken = typeof window !== 'undefined' && localStorage.getItem('token')
  const { user } = useAuth()
  const ability = useContext(AbilityContext)
  const isRestricted = !ability?.can('manage', 'all')

  useEffect(() => {
    if (!tripFormId) return

    const fetchData = async () => {
      try {
        const [managersRes, formRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/users?role=Manager`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripforms/${tripFormId}`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          })
        ])

        setManagers(managersRes.data.data.filter(u => u.role === 'Manager'))
        const form = formRes.data.data

        setFormData({
          managerId: form.managerId._id,
          formName: form.formName,
          isActive: form.isActive,
          questions: form.questions.map(q => ({
            _id: q._id,
            question: q.question,
            type: q.type,
            order: q.order,
            isRequired: q.isRequired
          }))
        })
      } catch (err) {
        toast.error('Failed to load form data')
        router.push('/tripForms')
      }
    }

    fetchData()
  }, [tripFormId])

  const handleSubmit = async updatedForm => {
    console.log(updatedForm)

    try {
      // Update form
      await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/tripforms/${tripFormId}`, updatedForm, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      toast.success('Trip form updated')
      router.push('/tripForms')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update form')
    }
  }

  if (!formData) return null

  return (
    <TripFormForm
      managers={managers}
      defaultValues={formData}
      onSubmitForm={handleSubmit}
      currentUser={user}
      isRestricted={isRestricted}
    />
  )
}

export default EditTripForm

EditTripForm.acl = {
  action: 'read',
  subject: 'trip-forms-edit'
}
