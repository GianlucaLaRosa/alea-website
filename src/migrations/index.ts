import * as migration_20260408_163823_initial from './20260408_163823_initial';
import * as migration_20260409_112500_header_logo_nav_anchor from './20260409_112500_header_logo_nav_anchor';
import * as migration_20260409_144111_add_header_sub_nav from './20260409_144111_add_header_sub_nav';
import * as migration_20260410_082204_footer_contact_social_documents from './20260410_082204_footer_contact_social_documents';
import * as migration_20260410_082552_remove_footer_nav_items from './20260410_082552_remove_footer_nav_items';
import * as migration_20260410_083600_footer_documents_upload from './20260410_083600_footer_documents_upload';
import * as migration_20260414_210500_events_collection from './20260414_210500_events_collection';

export const migrations = [
  {
    up: migration_20260408_163823_initial.up,
    down: migration_20260408_163823_initial.down,
    name: '20260408_163823_initial',
  },
  {
    up: migration_20260409_112500_header_logo_nav_anchor.up,
    down: migration_20260409_112500_header_logo_nav_anchor.down,
    name: '20260409_112500_header_logo_nav_anchor',
  },
  {
    up: migration_20260409_144111_add_header_sub_nav.up,
    down: migration_20260409_144111_add_header_sub_nav.down,
    name: '20260409_144111_add_header_sub_nav',
  },
  {
    up: migration_20260410_082204_footer_contact_social_documents.up,
    down: migration_20260410_082204_footer_contact_social_documents.down,
    name: '20260410_082204_footer_contact_social_documents',
  },
  {
    up: migration_20260410_082552_remove_footer_nav_items.up,
    down: migration_20260410_082552_remove_footer_nav_items.down,
    name: '20260410_082552_remove_footer_nav_items',
  },
  {
    up: migration_20260410_083600_footer_documents_upload.up,
    down: migration_20260410_083600_footer_documents_upload.down,
    name: '20260410_083600_footer_documents_upload',
  },
  {
    up: migration_20260414_210500_events_collection.up,
    down: migration_20260414_210500_events_collection.down,
    name: '20260414_210500_events_collection',
  },
];
