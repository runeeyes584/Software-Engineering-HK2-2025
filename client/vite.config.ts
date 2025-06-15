import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}); 



import NotFoundPage from "../app/404"; // Đường dẫn tới file 404.tsx của bạn

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route khác */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;