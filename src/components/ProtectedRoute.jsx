import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { supabase } from "../supabase"; 

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    const check = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          setAllowed(false)
          return
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setAllowed(!profileError && profile?.role === 'admin')
      } catch {
        setAllowed(false)
      }
    }
    check()
  }, [])

  if (allowed === null) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
      </div>
    )
  }
  if (!allowed) return <Navigate to="/login" />

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}