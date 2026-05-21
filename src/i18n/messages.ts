import type { LocaleCode } from '@/config/localization'

export type MessageKey =
  | 'common.close'
  | 'events.title'
  | 'events.description'
  | 'events.all'
  | 'events.upcoming'
  | 'events.past'
  | 'events.period.all'
  | 'events.period.upcoming'
  | 'events.period.past'
  | 'events.search.label'
  | 'events.search.placeholder'
  | 'events.search.clear'
  | 'events.search.noResults'
  | 'events.empty.filters'
  | 'events.search.found'
  | 'events.filter.aria'
  | 'events.carousel.cta'
  | 'events.search.resultsSuffix'
  | 'events.list.suffix'
  | 'events.carousel.label'
  | 'events.carousel.allTitle'
  | 'events.carousel.allDescription'
  | 'events.detail.back'
  | 'events.detail.openDetails'
  | 'events.detail.soldOutSuffix'
  | 'events.detail.addToCalendar'
  | 'events.detail.start'
  | 'events.detail.end'
  | 'events.detail.place'
  | 'events.ticket.default'
  | 'events.notFound'
  | 'events.status.scheduled'
  | 'events.status.soldOut'
  | 'events.status.cancelled'
  | 'events.gallery.preview'
  | 'events.gallery.title'
  | 'events.gallery.previous'
  | 'events.gallery.next'
  | 'events.gallery.position'
  | 'events.card.details'
  | 'footer.social'
  | 'footer.nav'
  | 'footer.navAria'
  | 'footer.contacts'
  | 'footer.documents'
  | 'footer.pec'
  | 'footer.taxCode'
  | 'footer.copyright'
  | 'language.select'
  | 'language.current'
  | 'nav.search'
  | 'nav.menu'
  | 'nav.main'
  | 'nav.subnav'
  | 'nav.subnavFor'
  | 'nav.showSubnav'
  | 'notFound.message'
  | 'notFound.home'
  | 'pagination.prev'
  | 'pagination.next'
  | 'pagination.prevAria'
  | 'pagination.nextAria'
  | 'pagination.morePages'
  | 'pageRange.noResults'
  | 'pageRange.showing'
  | 'posts.title'
  | 'posts.singular'
  | 'posts.plural'
  | 'search.title'
  | 'search.placeholder'
  | 'search.label'
  | 'search.submit'
  | 'search.noResults'
  | 'theme.light'
  | 'theme.dark'

const it: Record<MessageKey, string> = {
  'common.close': 'Chiudi',
  'events.title': 'Eventi',
  'events.description': 'Tutti gli eventi, passati e futuri.',
  'events.all': 'Tutti gli eventi',
  'events.upcoming': 'Eventi in arrivo',
  'events.past': 'Eventi passati',
  'events.period.all': 'Tutti',
  'events.period.upcoming': 'In arrivo',
  'events.period.past': 'Passati',
  'events.search.label': 'Cerca eventi',
  'events.search.placeholder': 'Cerca per titolo, descrizione, luogo o tag…',
  'events.search.clear': 'Cancella ricerca',
  'events.search.noResults': 'Nessun evento corrisponde alla ricerca.',
  'events.empty.filters': 'Nessun evento corrisponde ai filtri selezionati.',
  'events.search.found': '{count} eventi trovati',
  'events.filter.aria': 'Filtra per periodo',
  'events.carousel.cta': 'Vai agli eventi',
  'events.search.resultsSuffix': 'risultat',
  'events.list.suffix': ', ordinati per data di inizio.',
  'events.carousel.label': 'Eventi in evidenza',
  'events.carousel.allTitle': 'Tutti gli eventi',
  'events.carousel.allDescription': 'Apri l’archivio completo, inclusi gli eventi passati',
  'events.detail.back': 'Eventi',
  'events.detail.openDetails': 'Apri dettagli: {title}',
  'events.detail.soldOutSuffix': '— Sold out',
  'events.detail.addToCalendar': 'Aggiungi al calendario',
  'events.detail.start': 'Inizio',
  'events.detail.end': 'Fine',
  'events.detail.place': 'Luogo:',
  'events.ticket.default': 'Prenota',
  'events.notFound': 'Evento non trovato',
  'events.status.scheduled': 'In programma',
  'events.status.soldOut': 'Sold out',
  'events.status.cancelled': 'Annullato',
  'events.gallery.preview': 'Anteprima immagine',
  'events.gallery.title': 'Galleria',
  'events.gallery.previous': 'Immagine precedente',
  'events.gallery.next': 'Immagine successiva',
  'events.gallery.position': '{current} di {total}',
  'events.card.details': 'Dettagli',
  'footer.social': 'Social',
  'footer.nav': 'Navigazione',
  'footer.navAria': 'Navigazione footer',
  'footer.contacts': 'Sede e contatti',
  'footer.documents': 'Documenti',
  'footer.pec': 'PEC',
  'footer.taxCode': 'CF',
  'footer.copyright': 'Copyright © {year}',
  'language.select': 'Lingua',
  'language.current': 'Lingua corrente',
  'nav.search': 'Cerca nel sito',
  'nav.menu': 'Menu',
  'nav.main': 'Navigazione principale',
  'nav.subnav': 'Sottovoci',
  'nav.subnavFor': 'Sottovoci: {label}',
  'nav.showSubnav': 'Mostra sottovoci: {label}',
  'notFound.message': 'Pagina non trovata.',
  'notFound.home': 'Torna alla home',
  'pagination.prev': 'Precedente',
  'pagination.next': 'Successivo',
  'pagination.prevAria': 'Pagina precedente',
  'pagination.nextAria': 'Pagina successiva',
  'pagination.morePages': 'Altre pagine',
  'pageRange.noResults': 'Nessun risultato.',
  'pageRange.showing': 'Risultati {start}{range} di {total} {label}',
  'posts.title': 'Articoli',
  'posts.singular': 'articolo',
  'posts.plural': 'articoli',
  'search.title': 'Cerca',
  'search.placeholder': 'Cerca nel sito…',
  'search.label': 'Cerca',
  'search.submit': 'Cerca',
  'search.noResults': 'Nessun risultato.',
  'theme.light': 'Tema chiaro',
  'theme.dark': 'Tema scuro',
}

const en: Record<MessageKey, string> = {
  'common.close': 'Close',
  'events.title': 'Events',
  'events.description': 'All events, past and upcoming.',
  'events.all': 'All events',
  'events.upcoming': 'Upcoming events',
  'events.past': 'Past events',
  'events.period.all': 'All',
  'events.period.upcoming': 'Upcoming',
  'events.period.past': 'Past',
  'events.search.label': 'Search events',
  'events.search.placeholder': 'Search by title, description, place or tag…',
  'events.search.clear': 'Clear search',
  'events.search.noResults': 'No events match your search.',
  'events.empty.filters': 'No events match the selected filters.',
  'events.search.found': '{count} events found',
  'events.filter.aria': 'Filter by period',
  'events.carousel.cta': 'View all events',
  'events.search.resultsSuffix': 'result',
  'events.list.suffix': ', sorted by start date.',
  'events.carousel.label': 'Featured events',
  'events.carousel.allTitle': 'All events',
  'events.carousel.allDescription': 'Open the full archive, including past events',
  'events.detail.back': 'Events',
  'events.detail.openDetails': 'Open details: {title}',
  'events.detail.soldOutSuffix': '— Sold out',
  'events.detail.addToCalendar': 'Add to calendar',
  'events.detail.start': 'Start',
  'events.detail.end': 'End',
  'events.detail.place': 'Venue:',
  'events.ticket.default': 'Book',
  'events.notFound': 'Event not found',
  'events.status.scheduled': 'Scheduled',
  'events.status.soldOut': 'Sold out',
  'events.status.cancelled': 'Cancelled',
  'events.gallery.preview': 'Image preview',
  'events.gallery.title': 'Gallery',
  'events.gallery.previous': 'Previous image',
  'events.gallery.next': 'Next image',
  'events.gallery.position': '{current} of {total}',
  'events.card.details': 'Details',
  'footer.social': 'Social',
  'footer.nav': 'Navigation',
  'footer.navAria': 'Footer navigation',
  'footer.contacts': 'Office & contacts',
  'footer.documents': 'Documents',
  'footer.pec': 'PEC',
  'footer.taxCode': 'Tax ID',
  'footer.copyright': 'Copyright © {year}',
  'language.select': 'Language',
  'language.current': 'Current language',
  'nav.search': 'Search site',
  'nav.menu': 'Menu',
  'nav.main': 'Main navigation',
  'nav.subnav': 'Sub-links',
  'nav.subnavFor': 'Sub-links: {label}',
  'nav.showSubnav': 'Show sub-links: {label}',
  'notFound.message': 'This page could not be found.',
  'notFound.home': 'Go home',
  'pagination.prev': 'Previous',
  'pagination.next': 'Next',
  'pagination.prevAria': 'Go to previous page',
  'pagination.nextAria': 'Go to next page',
  'pagination.morePages': 'More pages',
  'pageRange.noResults': 'No results.',
  'pageRange.showing': 'Showing {start}{range} of {total} {label}',
  'posts.title': 'Posts',
  'posts.singular': 'post',
  'posts.plural': 'posts',
  'search.title': 'Search',
  'search.placeholder': 'Search the site…',
  'search.label': 'Search',
  'search.submit': 'Search',
  'search.noResults': 'No results found.',
  'theme.light': 'Light theme',
  'theme.dark': 'Dark theme',
}

const sl: Record<MessageKey, string> = {
  'common.close': 'Zapri',
  'events.title': 'Dogodki',
  'events.description': 'Vsi dogodki, pretekli in prihodnji.',
  'events.all': 'Vsi dogodki',
  'events.upcoming': 'Prihajajoči dogodki',
  'events.past': 'Pretekli dogodki',
  'events.period.all': 'Vsi',
  'events.period.upcoming': 'Prihajajoči',
  'events.period.past': 'Pretekli',
  'events.search.label': 'Išči dogodke',
  'events.search.placeholder': 'Išči po naslovu, opisu, kraju ali oznaki…',
  'events.search.clear': 'Počisti iskanje',
  'events.search.noResults': 'Noben dogodek ne ustreza iskanju.',
  'events.empty.filters': 'Noben dogodek ne ustreza izbranim filtrom.',
  'events.search.found': '{count} najdenih dogodkov',
  'events.filter.aria': 'Filtriraj po obdobju',
  'events.carousel.cta': 'Prikaži vse dogodke',
  'events.search.resultsSuffix': 'rezultat',
  'events.list.suffix': ', razvrščeno po datumu začetka.',
  'events.carousel.label': 'Izpostavljeni dogodki',
  'events.carousel.allTitle': 'Vsi dogodki',
  'events.carousel.allDescription': 'Odpri celoten arhiv, vključno s preteklimi dogodki',
  'events.detail.back': 'Dogodki',
  'events.detail.openDetails': 'Odpri podrobnosti: {title}',
  'events.detail.soldOutSuffix': '— Razprodano',
  'events.detail.addToCalendar': 'Dodaj v koledar',
  'events.detail.start': 'Začetek',
  'events.detail.end': 'Konec',
  'events.detail.place': 'Kraj:',
  'events.ticket.default': 'Rezerviraj',
  'events.notFound': 'Dogodek ni bil najden',
  'events.status.scheduled': 'Načrtovano',
  'events.status.soldOut': 'Razprodano',
  'events.status.cancelled': 'Preklicano',
  'events.gallery.preview': 'Predogled slike',
  'events.gallery.title': 'Galerija',
  'events.gallery.previous': 'Prejšnja slika',
  'events.gallery.next': 'Naslednja slika',
  'events.gallery.position': '{current} od {total}',
  'events.card.details': 'Podrobnosti',
  'footer.social': 'Družbena omrežja',
  'footer.nav': 'Navigacija',
  'footer.navAria': 'Navigacija v nogi',
  'footer.contacts': 'Sedež in kontakti',
  'footer.documents': 'Dokumenti',
  'footer.pec': 'PEC',
  'footer.taxCode': 'Davčna št.',
  'footer.copyright': 'Avtorske pravice © {year}',
  'language.select': 'Jezik',
  'language.current': 'Trenutni jezik',
  'nav.search': 'Išči po spletišču',
  'nav.menu': 'Meni',
  'nav.main': 'Glavna navigacija',
  'nav.subnav': 'Podmeni',
  'nav.subnavFor': 'Podmeni: {label}',
  'nav.showSubnav': 'Prikaži podmeni: {label}',
  'notFound.message': 'Strani ni bilo mogoče najti.',
  'notFound.home': 'Na začetno stran',
  'pagination.prev': 'Prejšnja',
  'pagination.next': 'Naslednja',
  'pagination.prevAria': 'Prejšnja stran',
  'pagination.nextAria': 'Naslednja stran',
  'pagination.morePages': 'Več strani',
  'pageRange.noResults': 'Ni rezultatov.',
  'pageRange.showing': 'Prikaz {start}{range} od {total} {label}',
  'posts.title': 'Članki',
  'posts.singular': 'članek',
  'posts.plural': 'članki',
  'search.title': 'Iskanje',
  'search.placeholder': 'Išči po spletišču…',
  'search.label': 'Išči',
  'search.submit': 'Išči',
  'search.noResults': 'Ni rezultatov.',
  'theme.light': 'Svetla tema',
  'theme.dark': 'Temna tema',
}

const catalogs: Record<LocaleCode, Record<MessageKey, string>> = { it, en, sl }

export function t(locale: LocaleCode, key: MessageKey): string {
  return catalogs[locale]?.[key] ?? catalogs.it[key] ?? key
}

export function formatMessage(
  locale: LocaleCode,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  let message = t(locale, key)
  if (!vars) return message

  for (const [name, value] of Object.entries(vars)) {
    message = message.replaceAll(`{${name}}`, String(value))
  }

  return message
}

export function getMessageCatalog(locale: LocaleCode): Record<MessageKey, string> {
  return catalogs[locale] ?? catalogs.it
}
