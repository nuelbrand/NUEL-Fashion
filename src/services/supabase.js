/**
 * SUPABASE CLIENT
 * ===============
 * FILE: src/services/supabase.js
 *
 * WHAT IS SUPABASE?
 *   Supabase is your database + authentication backend.
 *   It stores your products, user accounts, and orders.
 *   Think of it as your backend server, already built for you.
 *
 * WHAT THIS FILE DOES:
 *   Creates ONE Supabase connection that the whole app shares.
 *   Every other service file (products.js, auth.js, orders.js)
 *   imports this connection instead of creating a new one.
 *
 * WHY ONLY ONE CONNECTION?
 *   Creating multiple connections wastes memory and can cause
 *   bugs. One connection, shared everywhere = clean and efficient.
 */

import { createClient } from '@supabase/supabase-js'
import CONFIG from '../config/app.config.js'

// Create the Supabase client using credentials from your .env file
const supabase = createClient(
  CONFIG.SUPABASE.url,
  CONFIG.SUPABASE.anonKey
)

export default supabase
