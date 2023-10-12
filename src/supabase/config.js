import { createClient } from '@supabase/supabase-js'

const supabase_url = 'https://ipjhojteodybtrgfluro.supabase.co'
const anon_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwamhvanRlb2R5YnRyZ2ZsdXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYwMjg1MDcsImV4cCI6MjAxMTYwNDUwN30._SvN41MoosZ5qCPNqkXFuGQjTfPOXV_nb-_9vENgnmU'

export const supabase = createClient(supabase_url, anon_key)