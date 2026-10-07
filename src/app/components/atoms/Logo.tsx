import { useState } from 'react'
import avatar from '../../../assets/avatar.jpg'
import { useLang } from '../../state/LangContext'

// Picks up the wordmark from src/assets without a hard-coded filename: any png/svg/webp/jpg there
// except the avatar is used (e.g. wordmark.svg, kuji-wordmark.png). Drop the file in and it appears.
const ASSETS = import.meta.glob<string>('../../../assets/*.{png,svg,webp,jpg,jpeg}', { eager: true, query: '?url', import: 'default' })
const WORDMARK_SRC: string | null =
  Object.entries(ASSETS).find(([path]) => !/avatar/i.test(path))?.[1] ?? null

export function Logo() {
  const { t } = useLang()
  const [avatarOk, setAvatarOk] = useState(true)
  const [wordmarkOk, setWordmarkOk] = useState(true)
  return (
    <div className="flex items-center gap-2">
      {avatarOk && (
        <img src={avatar} alt="" onError={() => setAvatarOk(false)} className="h-10 w-10 rounded-full object-cover" />
      )}
      {WORDMARK_SRC && wordmarkOk ? (
        <img src={WORDMARK_SRC} alt={t('a11yWordmark')} onError={() => setWordmarkOk(false)} className="h-6 w-auto" />
      ) : (
        <span role="img" aria-label={t('a11yWordmark')} className="flex h-6 items-center rounded-md border border-dashed border-arctic bg-mist px-2 text-caption font-medium text-navy-65">
          {t('a11yPlaceholderMark')}
        </span>
      )}
    </div>
  )
}
