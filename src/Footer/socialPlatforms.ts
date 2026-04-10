import type { LucideIcon } from 'lucide-react'
import {
  FacebookIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  Link2Icon,
  MessageCircleIcon,
  SendIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react'

export const footerSocialPlatformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'X (Twitter)', value: 'twitter' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'GitHub', value: 'github' },
  { label: 'Altro', value: 'other' },
] as const

export type FooterSocialPlatform = (typeof footerSocialPlatformOptions)[number]['value']

export const footerSocialIconMap: Record<FooterSocialPlatform, LucideIcon> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
  whatsapp: MessageCircleIcon,
  telegram: SendIcon,
  github: GithubIcon,
  other: Link2Icon,
}
