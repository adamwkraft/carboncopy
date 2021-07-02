import faker from 'faker';

import {PEER_ID_BASE} from '../lib/constants';

export const makePeerId = id => PEER_ID_BASE + id;

export const cleanPeerId = id => id?.replace(PEER_ID_BASE, '');

export const makeNameOk = name => name.replace(/[^a-zA-Z0-9]/g, '');

export const getRandomId = () => faker.internet.userName();

