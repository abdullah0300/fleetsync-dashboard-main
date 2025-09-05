const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      action: 'read',
      subject: 'dashboard-page',
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
      action: 'read',
      subject: 'users-page',
      icon: 'tabler:user'
    },
    {
      path: '/drivers',
      title: 'Drivers',
      action: 'read',
      subject: 'drivers-page',
      icon: 'tabler:car'
    },
    {
      path: '/trucks',
      title: 'Trucks',
      action: 'read',
      subject: 'trucks-page',
      icon: 'tabler:truck'
    },
    {
      path: '/tripForms',
      title: 'Trip Forms',
      action: 'read',
      subject: 'trip-forms-page',
      icon: 'tabler:file-description'
    },
    {
      path: '/trip-form-responses',
      title: 'Trip Forms Responses',
      action: 'read',
      subject: 'trip-form-responses-page',
      icon: 'tabler:brand-pagekit'
    },
    {
      path: '/driver-logs',
      title: 'Driver Logs',
      action: 'read',
      subject: 'driver-logs-page',
      icon: 'tabler:logs'
    }
  ]
}

export default navigation
