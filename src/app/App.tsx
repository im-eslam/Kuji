import { memo } from 'react'
import { SECTIONS } from './data/menu'
import { sectionDomId, useScrollSpy } from './hooks/useScrollSpy'
import { LangProvider, useLang } from './state/LangContext'
import { OrderProvider } from './state/OrderContext'
import { UIProvider, useUI } from './state/UIContext'
import { SectionDivider } from './components/atoms/SectionDivider'
import { CategorySection } from './components/organisms/CategorySection'
import { CategorySheet } from './components/organisms/CategorySheet'
import { Header } from './components/organisms/Header'
import { ItemSheet } from './components/organisms/ItemSheet'
import { OfferSheet } from './components/organisms/OfferSheet'
import { OrderBar } from './components/organisms/OrderBar'
import { OrderSheet } from './components/organisms/OrderSheet'
import { PairingsSection } from './components/organisms/PairingsSection'
import { PromoPopup } from './components/organisms/PromoPopup'
import { SearchOverlay } from './components/organisms/SearchOverlay'
import { SignaturesSection } from './components/organisms/SignaturesSection'

const IDS = SECTIONS.map((s) => s.id)

// The whole menu body. It reads nothing that changes while scrolling, so the scroll-spy updating `activeId`
// (several times a second) re-renders only the header, never the ~60 cards.
const Sections = memo(function Sections() {
  const { lang } = useLang()
  return (
    <main>
      {SECTIONS.map((s, i) => (
        <section key={s.id} id={sectionDomId(s.id)} aria-label={s.title[lang]}>
          {i > 0 && <SectionDivider />}
          {s.kind === 'signatures' ? <SignaturesSection /> : s.kind === 'pairings' ? <PairingsSection /> : <CategorySection section={s} />}
        </section>
      ))}
    </main>
  )
})

function Shell() {
  const { lang, dir } = useLang()
  const { overlay, liveMessage } = useUI()
  const { activeId, goTo } = useScrollSpy(IDS)

  return (
    <div dir={dir} lang={lang} className="mx-auto min-h-dvh w-full max-w-120 bg-white text-navy">
      <Header activeId={activeId} onPill={goTo} />
      <Sections />
      <div className="h-28" aria-hidden="true" />
      <OrderBar />
      <div dir={dir} lang={lang}>
        {overlay.type === 'item' && <ItemSheet key={`${overlay.itemId}:${overlay.editKey ?? ''}`} itemId={overlay.itemId} editKey={overlay.editKey} instant={overlay.instant} />}
        {overlay.type === 'offer' && <OfferSheet key={`${overlay.offerId}:${overlay.editKey ?? ''}`} offerId={overlay.offerId} editKey={overlay.editKey} instant={overlay.instant} />}
        {overlay.type === 'categories' && <CategorySheet activeId={activeId} onPick={goTo} />}
        {overlay.type === 'order' && <OrderSheet instant={overlay.instant} />}
        {overlay.type === 'search' && <SearchOverlay onGoToSection={goTo} />}
        <PromoPopup />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{liveMessage}</p>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <OrderProvider>
        <UIProvider>
          <Shell />
        </UIProvider>
      </OrderProvider>
    </LangProvider>
  )
}
