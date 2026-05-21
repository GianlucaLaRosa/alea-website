import * as migration_20260408_163823_initial from './20260408_163823_initial';
import * as migration_20260409_112500_header_logo_nav_anchor from './20260409_112500_header_logo_nav_anchor';
import * as migration_20260409_144111_add_header_sub_nav from './20260409_144111_add_header_sub_nav';
import * as migration_20260410_082204_footer_contact_social_documents from './20260410_082204_footer_contact_social_documents';
import * as migration_20260410_082552_remove_footer_nav_items from './20260410_082552_remove_footer_nav_items';
import * as migration_20260410_083600_footer_documents_upload from './20260410_083600_footer_documents_upload';
import * as migration_20260414_210500_events_collection from './20260414_210500_events_collection';
import * as migration_20260521_155300_events_cover_gallery_tags from './20260521_155300_events_cover_gallery_tags';
import * as migration_20260521_170000_events_features from './20260521_170000_events_features';
import * as migration_20260521_180000_fix_events_status_enum from './20260521_180000_fix_events_status_enum';
import * as migration_20260521_181000_locked_documents_events_rels from './20260521_181000_locked_documents_events_rels';
import * as migration_20260521_182000_backfill_events_versions from './20260521_182000_backfill_events_versions';
import * as migration_20260521_190000_events_search_text from './20260521_190000_events_search_text';
import * as migration_20260521_191000_events_version_search_text from './20260521_191000_events_version_search_text';
import * as migration_20260521_192000_events_draft_nullable_columns from './20260521_192000_events_draft_nullable_columns';
import * as migration_20260521_202757_localization from './20260521_202757_localization';
import * as migration_20260521_210000_fix_events_version_links_id from './20260521_210000_fix_events_version_links_id';
import * as migration_20260522_120000_tags_rename_and_color from './20260522_120000_tags_rename_and_color';

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
  {
    up: migration_20260521_155300_events_cover_gallery_tags.up,
    down: migration_20260521_155300_events_cover_gallery_tags.down,
    name: '20260521_155300_events_cover_gallery_tags',
  },
  {
    up: migration_20260521_170000_events_features.up,
    down: migration_20260521_170000_events_features.down,
    name: '20260521_170000_events_features',
  },
  {
    up: migration_20260521_180000_fix_events_status_enum.up,
    down: migration_20260521_180000_fix_events_status_enum.down,
    name: '20260521_180000_fix_events_status_enum',
  },
  {
    up: migration_20260521_181000_locked_documents_events_rels.up,
    down: migration_20260521_181000_locked_documents_events_rels.down,
    name: '20260521_181000_locked_documents_events_rels',
  },
  {
    up: migration_20260521_182000_backfill_events_versions.up,
    down: migration_20260521_182000_backfill_events_versions.down,
    name: '20260521_182000_backfill_events_versions',
  },
  {
    up: migration_20260521_190000_events_search_text.up,
    down: migration_20260521_190000_events_search_text.down,
    name: '20260521_190000_events_search_text',
  },
  {
    up: migration_20260521_191000_events_version_search_text.up,
    down: migration_20260521_191000_events_version_search_text.down,
    name: '20260521_191000_events_version_search_text',
  },
  {
    up: migration_20260521_192000_events_draft_nullable_columns.up,
    down: migration_20260521_192000_events_draft_nullable_columns.down,
    name: '20260521_192000_events_draft_nullable_columns',
  },
  {
    up: migration_20260521_202757_localization.up,
    down: migration_20260521_202757_localization.down,
    name: '20260521_202757_localization',
  },
  {
    up: migration_20260521_210000_fix_events_version_links_id.up,
    down: migration_20260521_210000_fix_events_version_links_id.down,
    name: '20260521_210000_fix_events_version_links_id',
  },
  {
    up: migration_20260522_120000_tags_rename_and_color.up,
    down: migration_20260522_120000_tags_rename_and_color.down,
    name: '20260522_120000_tags_rename_and_color',
  },
];
