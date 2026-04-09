import * as migration_20260408_163823_initial from './20260408_163823_initial';
import * as migration_20260409_112500_header_logo_nav_anchor from './20260409_112500_header_logo_nav_anchor';
import * as migration_20260409_144111_add_header_sub_nav from './20260409_144111_add_header_sub_nav';

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
    name: '20260409_144111_add_header_sub_nav'
  },
];
