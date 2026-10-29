export type MapPath = { id: string; name: string; d: string }

export async function loadMapFeatures(): Promise<MapPath[]> {
 const response = await fetch('/in.svg')
 if (!response.ok) throw new Error('The India SVG map could not be loaded from public/in.svg.')
 const source = await response.text()
 const document = new DOMParser().parseFromString(source, 'image/svg+xml')
 const paths = Array.from(document.querySelectorAll('path[id^="IN"]'))
 return paths
  .map((path) => {
   const compactId = path.getAttribute('id') ?? ''
   return {
    id: compactId.length === 4 ? `${compactId.slice(0, 2)}-${compactId.slice(2)}` : compactId,
    name: path.getAttribute('name') ?? compactId,
    d: path.getAttribute('d') ?? ''
   }
  })
  .filter((path) => path.id && path.d)
}
