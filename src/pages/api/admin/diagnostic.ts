import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
      },
      authTest: null as string | null,
      adminTest: null as string | null,
      dbTest: null as string | null,
    };

    // Test basic auth client
    try {
      const { data: authTest } = await supabase.auth.getSession();
      diagnostics.authTest = 'OK - Auth client initialized';
    } catch (error) {
      diagnostics.authTest = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Test admin client
    try {
      const { data: adminTest } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 });
      diagnostics.adminTest = `OK - Found ${adminTest.users.length} users (limited query)`;
    } catch (error) {
      diagnostics.adminTest = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Test database connection
    try {
      const { data: dbTest, error: dbError } = await supabaseAdmin
        .from('users')
        .select('id')
        .limit(1);
      
      if (dbError) {
        diagnostics.dbTest = `DB Error: ${dbError.message}`;
      } else {
        diagnostics.dbTest = `OK - Database accessible, found ${dbTest?.length || 0} records`;
      }
    } catch (error) {
      diagnostics.dbTest = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    res.status(200).json(diagnostics);
  } catch (error) {
    console.error('Diagnostic API error:', error);
    res.status(500).json({ 
      error: 'Diagnostic failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}