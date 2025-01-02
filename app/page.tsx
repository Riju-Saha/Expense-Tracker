'use client'
import React from 'react'

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button style={styles.button} onClick={() => window.location.href = '/login'}>Login</button>
        <button style={styles.button} onClick={() => window.location.href = '/register'}>Register</button>
      </header>
      <main style={styles.main}>
        <h1 style={styles.title}>Welcome to Expense Tracker App</h1>
        <p style={styles.description}>
          Manage your expenses efficiently with this app. Track your daily, monthly, and yearly spending!
        </p>
      </main>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    margin: 0,
    padding: '2vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
  },
  header: {
    position: 'absolute' as 'absolute',
    top: 0,
    width: '100%',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  main: {
    textAlign: 'center' as 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.2rem',
    color: '#555',
  },
};