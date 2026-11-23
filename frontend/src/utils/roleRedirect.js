
export function getDashboardPath(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'MANAGER':
      return '/manager'
    case 'OPERATOR':
      return '/operator'
    case 'USER':
      return '/dashboard'
    default:
      return '/login'
  }
}
