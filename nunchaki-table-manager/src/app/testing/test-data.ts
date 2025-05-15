import { Nunchaku } from '../services/nunchaku.service';

export const TEST_NUNCHAKU: Nunchaku = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Nunchaku',
  material: 'Wood',
  length: 30,
  weight: 500
};

export const TEST_NUNCHAKU_PAYLOAD = {
  name: TEST_NUNCHAKU.name,
  material: TEST_NUNCHAKU.material,
  length: TEST_NUNCHAKU.length,
  weight: TEST_NUNCHAKU.weight
};

export const BASE_URL = 'http://localhost:8080';

export const API_PATHS = {
  NUNCHAKU: '/api/nunchaku',
  NUNCHAKU_BY_ID: (id: string) => `/api/nunchaku/${id}`
};

export const HTTP_RESPONSES = {
  POST: {
    status: 201,
    statusText: 'Created',
    headers: { 'Content-Type': 'application/json' }
  },
  PUT: {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' }
  },
  GET: {
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'application/json' }
  },
  DELETE: {
    status: 204,
    statusText: 'No Content',
    headers: { 'Content-Type': 'application/json' }
  }
}; 