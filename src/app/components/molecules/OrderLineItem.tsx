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

export function OrderLineItem({ line, ...handlers }: Props) {
  const { pick } = useLang()
  const part = line.parts[0]
  const item = ITEM_BY_ID[part.itemId]
  const size = part.sizeId && showSizeBlock(item.profile) ? SIZE_BY_ID.get(part.sizeId) : undefined
  const chips = [...(size ? [size.name] : []), ...part.addOnIds.map((id) => ADDON_BY_ID.get(id)!.name)]
  return (
    <OrderLineFrame
      line={line}
      title={pick(item.name)}
      thumb={<Img category={item.categoryId} className="h-16 w-16 shrink-0 rounded-md" />}
      details={chips.length > 0 ? <span className="flex flex-wrap gap-1">{chips.map((c, i) => <Chip key={i} compact>{pick(c)}</Chip>)}</span> : null}
      {...handlers}
    />
  )
}
