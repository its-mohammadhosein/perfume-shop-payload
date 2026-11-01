import * as migration_20261031_151117_initial from './20261031_151117_initial';
import * as migration_20261101_080928 from './20261101_080928';

export const migrations = [
  {
    up: migration_20261031_151117_initial.up,
    down: migration_20261031_151117_initial.down,
    name: '20261031_151117_initial',
  },
  {
    up: migration_20261101_080928.up,
    down: migration_20261101_080928.down,
    name: '20261101_080928'
  },
];
