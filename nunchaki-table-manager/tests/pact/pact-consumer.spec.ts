/// <reference types="mocha" />
/// <reference types="chai" />

const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const { expect } = require('chai');

// This test assumes you have @pact-foundation/pact and axios installed

describe('Nunchaku API Pact', () => {
  const provider = new Pact({
    consumer: 'NunchakuFrontend',
    provider: 'NunchakuAPI',
    port: 8888,
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
        path: '/nunchaku',
        headers: { 'Content-Type': 'application/json' },
        body: {
          name: 'Test Nunchaku',
          material: 'Wood',
          length: 30,
          weight: 500
        }
      },
      willRespondWith: {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: '1',
          name: 'Test Nunchaku',
          material: 'Wood',
          length: 30,
          weight: 500
        }
      }
    });

    const postResponse = await axios.post('http://localhost:8888/nunchaku', {
      name: 'Test Nunchaku',
      material: 'Wood',
      length: 30,
      weight: 500
    });
    expect(postResponse.status).to.equal(201);
    expect(postResponse.data).to.deep.equal({
      id: '1',
      name: 'Test Nunchaku',
      material: 'Wood',
      length: 30,
      weight: 500
    });

    await provider.verify();
  });

  it('should return a list with one record (GET interaction)', async () => {
    await provider.addInteraction({
      state: 'provider has one nunchaku',
      uponReceiving: 'a GET for the nunchaku list',
      withRequest: {
        method: 'GET',
        path: '/nunchaku',
        headers: { 'Accept': 'application/json' }
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: [
          {
            id: '1',
            name: 'Test Nunchaku',
            material: 'Wood',
            length: 30,
            weight: 500
          }
        ]
      }
    });

    const getResponse = await axios.get('http://localhost:8888/nunchaku', {
      headers: { 'Accept': 'application/json' }
    });
    expect(getResponse.status).to.equal(200);
    expect(getResponse.data).to.deep.equal([
      {
        id: '1',
        name: 'Test Nunchaku',
        material: 'Wood',
        length: 30,
        weight: 500
      }
    ]);

    await provider.verify();
  });

  it('should delete a record (DELETE interaction)', async () => {
    await provider.addInteraction({
      state: 'provider has one nunchaku',
      uponReceiving: 'a DELETE to remove a nunchaku',
      withRequest: {
        method: 'DELETE',
        path: '/nunchaku/1',
        headers: { 'Accept': 'application/json' }
      },
      willRespondWith: {
        status: 204,
        headers: { 'Content-Type': 'application/json' }
      }
    });

    const deleteResponse = await axios.delete('http://localhost:8888/nunchaku/1', {
      headers: { 'Accept': 'application/json' }
    });
    expect(deleteResponse.status).to.equal(204);

    await provider.verify();
  });
}); 