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
import * as migration_20260522_070404 from './20260522_070404';
import * as migration_20260522_074611 from './20260522_074611';
import * as migration_20260522_082339_announcement_bar from './20260522_082339_announcement_bar';
import * as migration_20260522_090747 from './20260522_090747';
import * as migration_20260522_120000_tags_rename_and_color from './20260522_120000_tags_rename_and_color';
import * as migration_20260522_130000_users_roles from './20260522_130000_users_roles';
import * as migration_20260522_140000_announcement_bar_global_seed from './20260522_140000_announcement_bar_global_seed';
import * as migration_20260522_150000_announcement_bar_color_picker from './20260522_150000_announcement_bar_color_picker';
import * as migration_20260522_160000_announcement_bar_single from './20260522_160000_announcement_bar_single';
import * as migration_20260522_170000_fix_announcement_campaign_id from './20260522_170000_fix_announcement_campaign_id';

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
    up: migration_20260522_070404.up,
    down: migration_20260522_070404.down,
    name: '20260522_070404',
  },
  {
    up: migration_20260522_074611.up,
    down: migration_20260522_074611.down,
    name: '20260522_074611',
  },
  {
    up: migration_20260522_082339_announcement_bar.up,
    down: migration_20260522_082339_announcement_bar.down,
    name: '20260522_082339_announcement_bar',
  },
  {
    up: migration_20260522_090747.up,
    down: migration_20260522_090747.down,
    name: '20260522_090747',
  },
  {
    up: migration_20260522_120000_tags_rename_and_color.up,
    down: migration_20260522_120000_tags_rename_and_color.down,
    name: '20260522_120000_tags_rename_and_color',
  },
  {
    up: migration_20260522_130000_users_roles.up,
    down: migration_20260522_130000_users_roles.down,
    name: '20260522_130000_users_roles',
  },
  {
    up: migration_20260522_140000_announcement_bar_global_seed.up,
    down: migration_20260522_140000_announcement_bar_global_seed.down,
    name: '20260522_140000_announcement_bar_global_seed',
  },
  {
    up: migration_20260522_150000_announcement_bar_color_picker.up,
    down: migration_20260522_150000_announcement_bar_color_picker.down,
    name: '20260522_150000_announcement_bar_color_picker',
  },
  {
    up: migration_20260522_160000_announcement_bar_single.up,
    down: migration_20260522_160000_announcement_bar_single.down,
    name: '20260522_160000_announcement_bar_single',
  },
  {
    up: migration_20260522_170000_fix_announcement_campaign_id.up,
    down: migration_20260522_170000_fix_announcement_campaign_id.down,
    name: '20260522_170000_fix_announcement_campaign_id'
  },
];
