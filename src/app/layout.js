// src/app/layout.js
import './globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './Home.module.css';
import { AuthProvider } from './context/AuthContext';
import Providers from './providers';

export const metadata = {
  title: 'CST FabLab',
  description: 'College of Science and Technology FabLab',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>CST FabLab</title>
      </head>
      <body>
        <Providers>
          <AuthProvider>
            <header></header>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
