import { startGame } from '../../frontend/javascript/start_game.js';
import * as indexModule from '../../frontend/javascript/index.js';
import * as optionsModule from '../../frontend/javascript/options.js';
import * as kaboomModule from '../../frontend/javascript/jatek/kaboomBetolto.js';

jest.mock('../../frontend/javascript/index.js', () => ({
  oldalTakarito: jest.fn(),
  fecthData: jest.fn(),
  visszaGomb: jest.fn(),
  dekor_vonal_blokkal: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    nyelv: 'en',
    volume: 0.5,
  },
}));

jest.mock('../../frontend/javascript/jatek/kaboomBetolto.js', () => ({
  KaboomBetolto: jest.fn(),
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mainData = {
  data: {
    valassz: 'Válassz egy mentést',
    uj_jatek: 'Új játék',
    vissza: 'Vissza',
  },
};

const szobaNevekData = {
  data: {
    mitteous: 'Mitteous',
    iacon: 'Iacon',
    medbay: 'Medbay',
    kaon: 'Kaon',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  localStorage.clear();

  localStorage.setItem(
    'user',
    JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }),
  );

  for (let i = 1; i <= 4; i++) {
    localStorage.setItem(
      'mentes_' + i,
      JSON.stringify({ data: { mentett_adatok: { savepoint: null } } }),
    );
  }

  indexModule.visszaGomb.mockReturnValue(document.createElement('button'));
  indexModule.dekor_vonal_blokkal.mockReturnValue(document.createElement('hr'));
});

describe('startGame', () => {
  test('meghívja az oldalTakarito-t és lekéri a szükséges adatokat', async () => {
    indexModule.fecthData
      .mockResolvedValueOnce(mainData)
      .mockResolvedValueOnce(szobaNevekData);

    await startGame();

    expect(indexModule.oldalTakarito).toHaveBeenCalled();
    expect(indexModule.fecthData).toHaveBeenCalledTimes(2);
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/en/start_game.json',
    );
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/en/szoba_nevek.json',
    );
  });

  test('létrehoz 4 játékfájl elemet és megfelelő osztályokat ad nekik', async () => {
    indexModule.fecthData
      .mockResolvedValueOnce(mainData)
      .mockResolvedValueOnce(szobaNevekData);

    await startGame();

    const jatekFajlok = document.querySelectorAll('.jatek_fajlok'); 
    expect(jatekFajlok.length).toBe(4);
    for (let i = 0; i < 4; i++) {
      expect(jatekFajlok[i].id).toBe('jatek_fajlok_' + (i + 1));
      expect(jatekFajlok[i].classList.contains('p-4')).toBe(true);
    }
  });

  test('a játékfájl gombokra kattintva indítja a KaboomBetolto-t', async () => {
    indexModule.fecthData
      .mockResolvedValueOnce(mainData)
      .mockResolvedValueOnce(szobaNevekData);

    await startGame();

    const jatekFajlok = document.querySelectorAll('.jatek_fajlok');
    jatekFajlok[0].click();
    expect(indexModule.oldalTakarito).toHaveBeenCalledTimes(2);
    expect(kaboomModule.KaboomBetolto).toHaveBeenCalledWith(1);

    jatekFajlok[1].click();
    expect(kaboomModule.KaboomBetolto).toHaveBeenCalledWith(2);
  });

  test('a visszaGomb hívása a megfelelő szöveggel, és hozzáadása a DOM-hoz', async () => {
    indexModule.fecthData
      .mockResolvedValueOnce(mainData)
      .mockResolvedValueOnce(szobaNevekData);

    await startGame();

    expect(indexModule.visszaGomb).toHaveBeenCalledWith('Vissza');
    const visszaDiv = document.querySelector('.gombok.row');
    expect(visszaDiv).not.toBeNull();
    expect(visszaDiv.children.length).toBe(1);
  });
});