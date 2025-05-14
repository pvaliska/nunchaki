/// <reference types="mocha" />
/// <reference types="chai" />

const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const chai = require('chai');
const { TEST_NUNCHAKU, TEST_NUNCHAKU_PAYLOAD, BASE_URL, API_PATHS, HTTP_RESPONSES } = require('../../src/app/testing/test-data');

// This test assumes you have @pact-foundation/pact and axios installed

describe('Nunchaku API Pact', () => {
  const provider = new Pact({
    consumer: 'NunchakuFrontend',
    provider: 'NunchakuAPI',
    port: 8080,
    log: process.cwd() + '/logs/pact.log',
    dir: process.cwd() + '/pacts',
    logLevel: 'debug',
    spec: 2
  });

  before(function(this: Mocha.Context) {
    this.timeout(10000);
    return provider.setup();
  });
  after(() => provider.finalize());

  it('should save a record (POST interaction)', async () => {
    await provider.addInteraction({
      state: 'provider allows record creation',
      uponReceiving: 'a POST to create a nunchaku',
      withRequest: {
        method: 'POST',
        path: API_PATHS.NUNCHAKU,
        headers: { 'Content-Type': 'application/json' },
        body: TEST_NUNCHAKU_PAYLOAD
      },
      willRespondWith: {
        status: HTTP_RESPONSES.POST.status,
        headers: HTTP_RESPONSES.POST.headers,
        body: TEST_NUNCHAKU
      }
    });

    const postResponse = await axios.post(`${BASE_URL}${API_PATHS.NUNCHAKU}`, TEST_NUNCHAKU_PAYLOAD);
    chai.expect(postResponse.status).to.equal(HTTP_RESPONSES.POST.status);
    chai.expect(postResponse.data).to.deep.equal(TEST_NUNCHAKU);

    await provider.verify();
  });

  it('should return a list with one record (GET interaction)', async () => {
    await provider.addInteraction({
      state: 'provider has one nunchaku',
      uponReceiving: 'a GET for the nunchaku list',
      withRequest: {
        method: 'GET',
        path: API_PATHS.NUNCHAKU,
        headers: { 'Accept': 'application/json' }
      },
      willRespondWith: {
        status: HTTP_RESPONSES.GET.status,
        headers: HTTP_RESPONSES.GET.headers,
        body: [TEST_NUNCHAKU]
      }
    });

    const getResponse = await axios.get(`${BASE_URL}${API_PATHS.NUNCHAKU}`, {
      headers: { 'Accept': 'application/json' }
    });
    chai.expect(getResponse.status).to.equal(HTTP_RESPONSES.GET.status);
    chai.expect(getResponse.data).to.deep.equal([TEST_NUNCHAKU]);

    await provider.verify();
  });

  it('should delete a record (DELETE interaction)', async () => {
    await provider.addInteraction({
      state: 'provider has one nunchaku',
      uponReceiving: 'a DELETE to remove a nunchaku',
      withRequest: {
        method: 'DELETE',
        path: API_PATHS.NUNCHAKU_BY_ID(TEST_NUNCHAKU.id),
        headers: { 'Accept': 'application/json' }
      },
      willRespondWith: {
        status: HTTP_RESPONSES.DELETE.status,
        headers: HTTP_RESPONSES.DELETE.headers
      }
    });

    const deleteResponse = await axios.delete(`${BASE_URL}${API_PATHS.NUNCHAKU_BY_ID(TEST_NUNCHAKU.id)}`, {
      headers: { 'Accept': 'application/json' }
    });
    chai.expect(deleteResponse.status).to.equal(HTTP_RESPONSES.DELETE.status);

    await provider.verify();
  });
}); 