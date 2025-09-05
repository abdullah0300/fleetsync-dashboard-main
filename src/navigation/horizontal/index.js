const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home'
  },

  // {
  //   title: 'Second Page',
  //   path: '/second-page',
  //   icon: 'tabler:mail'
  // },
  // {
  //   path: '/acl',
  //   action: 'read',
  //   subject: 'acl-page',
  //   title: 'Access Control',
  //   icon: 'tabler:shield'
  // },
  {
    path: '/companies',
    title: 'Companies',
    action: 'read',
    subject: 'companies-page',
    icon: 'tabler:building'
  },
  {
    path: '/users',
    title: 'Users',
    icon: 'tabler:user'
  },
  {
    path: '/drivers',
    title: 'Drivers',
    icon: 'tabler:driver'
  },
  {
    path: '/trucks',
    title: 'Trucks',
    icon: 'tabler:truck'
  },
  {
    path: '/tripForms',
    title: 'Trip Forms',
    icon: 'tabler:trip'
  },
  {
    path: '/trip-form-responses',
    title: 'Trip Forms Responses',
    icon: 'tabler:brand-pagekit'
  },
  {
    path: '/driver-logs',
    title: 'Driver Logs',
    icon: 'tabler:logs'
  }
]

export default navigation
