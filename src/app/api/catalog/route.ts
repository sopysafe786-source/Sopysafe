import { getCatalogState, resetCatalogState, saveCatalogState } from '@/server/storage/catalog-store'
import type { CatalogState } from '@/server/storage/catalog-store'

function parseJsonBody<T>(request: Request) {
  return request.json().catch(() => null) as Promise<T | null>
}

export async function GET() {
  return Response.json({ catalog: getCatalogState() })
}

export async function PUT(request: Request) {
  const body = await parseJsonBody<Partial<CatalogState>>(request)

  if (!body) {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const catalog = saveCatalogState(body)
    return Response.json({ catalog })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save catalog'
    return Response.json({ message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { reset?: boolean } | null
  if (body?.reset) {
    const catalog = resetCatalogState()
    return Response.json({ catalog })
  }

  return Response.json({ message: 'Unsupported request' }, { status: 400 })
}
