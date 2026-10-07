import { useState } from 'react'
import { useLang } from '../../state/LangContext'

const AVATAR_SRC = '/assest/avatar.jpg'
const WORDMARK_SRC = '/assest/wordmark.jpg'

export function Logo() {
  const { t } = useLang()
  const [avatarOk, setAvatarOk] = useState(true)
  const [wordmarkOk, setWordmarkOk] = useState(true)
  return (
    <div className="flex items-center gap-2">
      {avatarOk && (
        <img src={AVATAR_SRC} alt="" onError={() => setAvatarOk(false)} className="h-10 w-10 rounded-full object-cover" />
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
