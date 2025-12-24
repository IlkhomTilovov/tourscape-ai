import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch all tours
    const { data: tours, error: toursError } = await supabase
      .from('tours')
      .select('id, updated_at')
      .order('created_at', { ascending: false })

    if (toursError) {
      console.error('Error fetching tours:', toursError)
      throw toursError
    }

    // Fetch all destinations
    const { data: destinations, error: destError } = await supabase
      .from('destinations')
      .select('id, updated_at')
      .order('created_at', { ascending: false })

    if (destError) {
      console.error('Error fetching destinations:', destError)
    }

    // Fetch all categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, updated_at')
      .order('created_at', { ascending: false })

    if (catError) {
      console.error('Error fetching categories:', catError)
    }

    const baseUrl = 'https://bestour.uz'
    const today = new Date().toISOString().split('T')[0]

    // Static pages
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/tours', priority: '0.9', changefreq: 'daily' },
      { loc: '/destinations', priority: '0.8', changefreq: 'weekly' },
      { loc: '/categories', priority: '0.7', changefreq: 'weekly' },
      { loc: '/hotels', priority: '0.7', changefreq: 'weekly' },
      { loc: '/about', priority: '0.6', changefreq: 'monthly' },
    ]

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
    }

    // Add tour pages
    if (tours && tours.length > 0) {
      for (const tour of tours) {
        const lastmod = tour.updated_at 
          ? new Date(tour.updated_at).toISOString().split('T')[0]
          : today
        xml += `  <url>
    <loc>${baseUrl}/tours/${tour.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
      }
    }

    // Add destination pages (if you have individual destination pages)
    if (destinations && destinations.length > 0) {
      for (const dest of destinations) {
        const lastmod = dest.updated_at 
          ? new Date(dest.updated_at).toISOString().split('T')[0]
          : today
        xml += `  <url>
    <loc>${baseUrl}/destinations/${dest.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
      }
    }

    // Add category pages (if you have individual category pages)
    if (categories && categories.length > 0) {
      for (const cat of categories) {
        const lastmod = cat.updated_at 
          ? new Date(cat.updated_at).toISOString().split('T')[0]
          : today
        xml += `  <url>
    <loc>${baseUrl}/categories/${cat.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`
      }
    }

    xml += `</urlset>`

    console.log(`Sitemap generated with ${staticPages.length + (tours?.length || 0) + (destinations?.length || 0) + (categories?.length || 0)} URLs`)

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { 
        headers: corsHeaders,
        status: 500 
      }
    )
  }
})
