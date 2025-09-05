import { Ability, AbilityBuilder } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility)
  if (role === 'SuperAdmin') {
    can('manage', 'all')
  } else if (role === 'client') {
    can(['read'], 'acl-page')
  } else if (role === 'Manager') {
    // can('manage', 'all')
    can(['read', 'manage'], 'dashboard-page')
    cannot(['read'], 'companies-page')
    can(['read', 'manage'], 'users-page')
    can(['read', 'manage'], 'users-add')
    can(['read', 'manage'], 'users-edit')
    can(['read', 'manage'], 'users-delete')

    can(['read', 'manage'], 'drivers-page')
    can(['read', 'manage'], 'drivers-add')
    can(['read', 'manage'], 'drivers-edit')
    can(['read', 'manage'], 'drivers-delete')

    can(['read', 'manage'], 'trucks-page')
    can(['read', 'manage'], 'trucks-add')
    can(['read', 'manage'], 'trucks-edit')
    can(['read', 'manage'], 'trucks-delete')

    can(['read', 'manage'], 'trip-forms-page')
    can(['read', 'manage'], 'trip-forms-add')
    can(['read', 'manage'], 'trip-forms-edit')
    can(['read', 'manage'], 'trip-forms-delete')

    can(['read', 'manage'], 'trip-form-responses-page')
    can(['read', 'manage'], 'driver-logs-page')
  } else {
    can(['read', 'create', 'update', 'delete'], subject)
  }

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
