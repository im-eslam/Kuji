import { ITEM_BY_ID } from '../../data/menu'
import { useLang } from '../../state/LangContext'
import { ADDON_BY_ID, SIZE_BY_ID, showSizeBlock } from '../../lib/options'
import type { OrderLine as Line } from '../../data/types'
import { Chip } from '../atoms/Chip'
import { Img } from '../atoms/Image'
import { OrderLineFrame } from './OrderLine'

interface Props {
  line: Line
  onEdit: (line: Line) => void
  onSetQty: (line: Line, qty: number) => void
  onRemove: (line: Line) => void
}

export function OrderLineBundle({ line, ...handlers }: Props) {
  const { pick } = useLang()
  const items = line.parts.map((p) => ITEM_BY_ID[p.itemId])
  const names = items.map((i) => pick(i.name))
  // The title already names both products, so only a product that has chips gets a line of its own.
  const rows = line.parts.flatMap((p, i) => {
    const size = p.sizeId && showSizeBlock(items[i].profile) ? SIZE_BY_ID.get(p.sizeId) : undefined
    const chips = [...(size ? [size.name] : []), ...p.addOnIds.map((id) => ADDON_BY_ID.get(id)!.name)]
    return chips.length > 0 ? [{ name: names[i], chips }] : []
  })
  return (
    <OrderLineFrame
      line={line}
      title={names.join(' + ')}
      thumb={
        <span className="flex h-16 w-16 shrink-0 gap-1">
          <Img category={items[0].categoryId} className="h-full flex-1 rounded-md" />
          <Img category={items[1].categoryId} className="h-full flex-1 rounded-md" />
        </span>
      }
      details={
        rows.length > 0 ? (
          <span className="flex flex-col gap-1">
            {rows.map((r, i) => (
              <span key={i} className="flex flex-wrap items-center gap-1">
                <span className="text-caption font-medium text-navy-65">{r.name}</span>
                {r.chips.map((c, j) => <Chip key={j} compact>{pick(c)}</Chip>)}
              </span>
            ))}
          </span>
        ) : null
      }
      {...handlers}
    />
  )
}
