import { SECTIONS } from '../../data/menu'
import { OFFER_BY_ID } from '../../lib/pricing'
import { useLang } from '../../state/LangContext'
import { useUI } from '../../state/UIContext'
import { OfferCard } from '../molecules/OfferCard'
import { SectionHead } from '../molecules/SectionHead'

export function PairingsSection() {
  const { pick } = useLang()
  const { openOffer } = useUI()
  const section = SECTIONS[1]
  return (
    <div className="flex flex-col gap-4 pt-6 pb-5">
      <SectionHead title={pick(section.title)} sub={section.sub && pick(section.sub)} />
      {/* pb-1: the rail clips anything outside it, which shaved the cards' bottom corners. The section's bottom padding is 4px smaller to compensate. */}
      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 scroll-ps-4">
        {section.itemIds.map((id) => (
          <div key={id} className="w-(--card-offer) shrink-0 snap-start"><OfferCard offer={OFFER_BY_ID[id]} onOpen={openOffer} /></div>
        ))}
      </div>
    </div>
  )
}
