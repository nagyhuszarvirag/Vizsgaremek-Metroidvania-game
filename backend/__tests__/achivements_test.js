let ShowAchivements;
let indexModule;
let optionsModule;

jest.mock('../../frontend/javascript/index.js', () => ({
  oldalTakarito: jest.fn(),
  fecthData: jest.fn(),
  visszaGomb: jest.fn(),
  dekor_vonal_blokkal: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    nyelv: 1,
    volume: 0.5,
    controls: {
      forward: 'd',
      back: 'a',
      jump: 'space',
      attack: 'left click',
      interact: 'e',
    },
    mobileMode: false,
  },
}));

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const mockNyelviAdat = {
  data: {
    cim: 'Achievementek',
    felfed: 'Kattints a felfedéshez',
    vissza: 'Vissza',
  },
};

const mockAchievements = {
  data: [
    {
      unlocked: true,
      achievement_title: 'Első lépések',
      achievement_text: 'Teljesítetted az első pályát.',
    },
    {
      unlocked: false,
      achievement_title: 'Mester',
      achievement_text: 'Teljesíts minden pályát.',
    },
  ],
};

const mockVisszaGomb = document.createElement('button');
mockVisszaGomb.textContent = 'Vissza';
const mockDekorVonal = document.createElement('hr');

beforeEach(() => {
  jest.resetModules();

  indexModule = require('../../frontend/javascript/index.js');
  optionsModule = require('../../frontend/javascript/options.js');
  ShowAchivements = require('../../frontend/javascript/achivements.js').ShowAchivements;

  document.body.innerHTML = '';
  localStorage.clear();

  localStorage.setItem(
    'user',
    JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }),
  );
  localStorage.setItem('achivements_hu', JSON.stringify(mockAchievements));

  indexModule.fecthData.mockImplementation((url) => {
    if (url.endsWith('/achivements.json')) {
      return Promise.resolve(mockNyelviAdat);
    }
    if (url.includes('/api/showachivements/')) {
      return Promise.resolve(mockAchievements);
    }
    return Promise.resolve(null);
  });

  indexModule.visszaGomb.mockReturnValue(mockVisszaGomb.cloneNode(true));
  indexModule.dekor_vonal_blokkal.mockReturnValue(mockDekorVonal.cloneNode(true));
  indexModule.oldalTakarito.mockClear();
});

describe('ShowAchivements', () => {
  test('meghívja az oldalTakarito-t és lekéri a szükséges adatokat', async () => {
    await ShowAchivements();

    expect(indexModule.oldalTakarito).toHaveBeenCalled();
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/achivements.json',
    );
  });


  test('vendég felhasználó esetén angol nyelven is működik', async () => {
    optionsModule.settings.nyelv = 2;
    localStorage.setItem('achivements_en', JSON.stringify(mockAchievements));

    await ShowAchivements();

    const achievementDivs = document.querySelectorAll('.achivement_container .container');
    expect(achievementDivs.length).toBe(2);
  });

  test('bejelentkezett felhasználó esetén API-ból kéri le az adatokat', async () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 42, usernev: 'teszt', jog: 1 }),
    );

    await ShowAchivements();

    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/showachivements/42/1',
    );

    const achievementDivs = document.querySelectorAll('.achivement_container .container');
    expect(achievementDivs.length).toBe(2);
  });

  test('meghívja a dekor_vonal_blokkal-t kétszer', async () => {
    await ShowAchivements();

    expect(indexModule.dekor_vonal_blokkal).toHaveBeenCalledTimes(2);
  });

  test('visszaGomb hozzáadása a megfelelő szöveggel', async () => {
    await ShowAchivements();

    expect(indexModule.visszaGomb).toHaveBeenCalledWith('Vissza');

    const container = document.querySelector('.achivement_container');
    const lastChild = container.lastChild;
    expect(lastChild.querySelector('button')).not.toBeNull();
  });

  test('hiba esetén, ha a vendég nyelv ismeretlen, kivételt dob', async () => {
    optionsModule.settings.nyelv = 99;

    await expect(ShowAchivements()).rejects.toThrow('Ismeretlen nyelv!');

    optionsModule.settings.nyelv = 1;
  });
});