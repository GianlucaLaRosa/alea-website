import React from 'react'

interface Props {
  /** Classi complete per l'immagine (merge lato parent per evitare mismatch SSR/client). */
  className: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Home"
      width={193}
      height={193}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={className}
      src="/alea_logo.png"
    />
  )
}
