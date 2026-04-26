import { loadCredits } from '../../frontend/javascript/credits.js';
import * as indexModule from '../../frontend/javascript/index.js';
import * as optionsModule from '../../frontend/javascript/options.js';

jest.mock('../../frontend/javascript/index.js', () => ({
  fecthData: jest.fn(),
  oldalTakarito: jest.fn(),
  visszaGomb: jest.fn(),
  dekor_vonal_blokkal: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    nyelv: 'en',
    volume: 0.5,
  },
}));

const mockData = {
  data: {
    credits: 'Készítők',
    Fo_kozremukodok: ['Fejlesztő 1', 'Fejlesztő 2'],
    Tovabbi_segitok: ['Segítő A', 'Segítő B'],
    vissza: 'Vissza',
  },
};

beforeEach(() => {
  document.body.innerHTML = '';
  indexModule.fecthData.mockImplementation(() => Promise.resolve(mockData));
  indexModule.visszaGomb.mockReturnValue(document.createElement('button'));
  indexModule.dekor_vonal_blokkal.mockReturnValue(document.createElement('hr'));
});

describe('loadCredits', () => {
  test('meghívja az oldalTakarito-t és lekéri a megfelelő JSON fájlt', async () => {
    await loadCredits();

    expect(indexModule.oldalTakarito).toHaveBeenCalled();
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/en/credits.json'
    );
  });

  test('létrehozza a .credits_container-t és a címet', async () => {
    await loadCredits();

    const container = document.querySelector('.credits_container');
    expect(container).not.toBeNull();

    const h1 = container.querySelector('h1');
    expect(h1).not.toBeNull();
  });

  test('meghívja a dekor_vonal_blokkal-t', async () => {
    await loadCredits();

    expect(indexModule.dekor_vonal_blokkal).toHaveBeenCalled();
  });

  test('létrehozza a scrolldiv-et és benne a közreműködők listáit', async () => {
    await loadCredits();

    const scrolldiv = document.querySelector('.scrolldiv');
    expect(scrolldiv).not.toBeNull();

    const rows = scrolldiv.children;
    expect(rows.length).toBe(2);

    const firstPs = rows[0].querySelectorAll('p');
    expect(firstPs.length).toBe(2);
    expect(firstPs).not.toBeNull();

    const secondPs = rows[1].querySelectorAll('p');
    expect(secondPs.length).toBe(2);
    expect(secondPs).not.toBeNull();
  });

  test('meghívja a visszaGombot a megfelelő szöveggel', async () => {
    await loadCredits();

    expect(indexModule.visszaGomb).toHaveBeenCalledWith('Vissza');
  });

  test('a vissza gomb bekerül a DOM-ba', async () => {
    await loadCredits();

    const container = document.querySelector('.credits_container');
    const lastDiv = container.lastChild;
    expect(lastDiv.children.length).toBe(1); 
  });
});