export const adminMenu = [
  { label: 'Dashboard', icon: 'dashboard', route: 'home/dashboardPage' },
  { label: 'Families', icon: 'group', route: 'home/family' },
  { label: 'Payments', icon: 'payments', route: 'home/payments' },
  { label: 'Outward Requests', icon: 'assignment', route: 'home/viewOutwardPayments' },
  { label: 'Activities', icon: 'event', route: 'home/activities' },
  { label: 'Invoices', icon: 'insert_chart', route: 'home/reports' },
];

export const userMenu = [
  { label: 'Dashboard', icon: 'dashboard', route: 'home/dashboardPage' },
  { label: 'Make Payment', icon: 'payment', route: 'home/makePayment' },
  { label: 'Outward Requests', icon: 'assignment', route: 'home/outwardPayments' },
  { label: 'Complaints', icon: 'chat_bubble_outline', route: 'home/complaints' },
  { label: 'Help & Support', icon: 'help_outline', route: 'home/help' }
];