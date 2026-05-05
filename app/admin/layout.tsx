import AdminNavbar from '@/components/admin/AdminNavbar';
import { Box } from '@mui/material';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminNavbar />
      <Box component="main" sx={{ py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
