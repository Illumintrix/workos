import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nyjvqnuxuaoyofglnsnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55anZxbnV4dWFveW9mZ2xuc25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1MDM5MDMsImV4cCI6MjA3MTA3OTkwM30.IE3x1CmqgMkf5yRMcFTA0c8u5uERUrwf-bovLDW7iv8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
