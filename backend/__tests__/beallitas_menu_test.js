let mod;

jest.mock('../../frontend/javascript/index.js', () => ({
  oldalTakarito: jest.fn(),
  fecthData: jest.fn(),
  visszaGomb: jest.fn(),
  dekor_vonal_blokkal: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    volume: 0.5,
    nyelv: 1,
    controls: {
      forward: 'd',
      back: 'a',
      jump: 'space',
      attack: 'left click',
      interact: 'e',
    },
    mobileMode: false,
  },
  irNyelv: jest.fn(),
}));

jest.mock('../../frontend/javascript/admin_panel.js', () => ({
  adminPanelLetrehoz: jest.fn(),
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

global.fetch = jest.fn();
window.alert = jest.fn();
window.confirm = jest.fn();
window.dispatchEvent = jest.fn();

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

const nyelvDataMock = {
  data: {
    cim: 'Beállítások',
    tab: ['Általános', 'Fiók'],
    vissza: 'Vissza',
    hangero: 'Hangerő',
    billentyu: ['Előre', 'Hátra', 'Ugrás', 'Támadás', 'Interakció'],
    nyelv: ['Nyelv', 'Magyar', 'Angol'],
    mobilMod: 'Mobil mód',
    mentes: 'Mentés',
    mentett: 'Beállítások mentve!',
    fiokszoveg: 'Vendég módban nem érhető el',
    felhasznalonev: 'Felhasználónév',
    email: 'Email',
    fiokmentes: 'Mentés',
    fiokalert: 'Fiókadatok mentve!',
    torles: 'Fiók törlése',
    torlesalert: 'Biztosan törlöd a fiókodat?',
    admin: 'Admin panel',
  },
};

const mockVisszaGomb = document.createElement('button');
mockVisszaGomb.textContent = 'Vissza';
const mockDekorVonal = document.createElement('hr');

beforeEach(() => {
  jest.resetModules();
  mod = require('../../frontend/javascript/beallitas_menu.js');

  const indexModule = require('../../frontend/javascript/index.js');
  indexModule.fecthData.mockResolvedValue(nyelvDataMock);
  indexModule.visszaGomb.mockReturnValue(mockVisszaGomb.cloneNode(true));
  indexModule.dekor_vonal_blokkal.mockReturnValue(mockDekorVonal.cloneNode(true));
  indexModule.oldalTakarito.mockClear();

  localStorage.clear();
  localStorage.setItem('nyelv', '1');
  localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));

  global.fetch.mockClear();
  window.alert.mockClear();
  window.confirm.mockClear();
  window.dispatchEvent.mockClear();

  document.body.innerHTML = '';
});

describe('beallitasokBetolteseSettingsbe', () => {
  test('vendég felhasználó esetén az alapértelmezett beállításokat használja', async () => {
    await mod.beallitasokBetolteseSettingsbe(0);
    const { settings } = require('../../frontend/javascript/options.js');
    expect(settings.volume).toBe(0.5);
    expect(settings.nyelv).toBe(1);
    expect(settings.controls.forward).toBe('d');
  });

  test('bejelentkezett felhasználónál szerverről tölti be a beállításokat', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: {
          hangero: '0.8',
          nyelv_id: '2',
          kiosztas: JSON.stringify({
            playerEloreMegyGombja: 'w',
            playerHatraMegyGombja: 's',
            playerUgroGombja: ' ',
            playerAttackGombja: 'click',
            playerInteractGombja: 'f',
          }),
        },
      }),
    });

    await mod.beallitasokBetolteseSettingsbe(42);
    const { settings } = require('../../frontend/javascript/options.js');
    expect(settings.volume).toBe(0.8);
    expect(settings.nyelv).toBe(2);
    expect(settings.controls.forward).toBe('w');
    expect(settings.controls.jump).toBe(' ');
    expect(settings.controls.attack).toBe('click');
  });
});

describe('beallitasMenuLetrehoz', () => {

  test('meghívja az oldalTakarito-t és a fecthData-t', async () => {
    await mod.beallitasMenuLetrehoz(0);
    const indexModule = require('../../frontend/javascript/index.js');
    expect(indexModule.oldalTakarito).toHaveBeenCalled();
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/beallitas_menu.json'
    );
  });
});

describe('valtasAltalanos (Általános fül)', () => {
  test('megjeleníti a hangerő csúszkát és a billentyűket', async () => {
    await mod.beallitasMenuLetrehoz(0);
    const tab = document.querySelector('.gombok.center');
    tab.click();
    await new Promise(process.nextTick);

    const content = document.querySelector('.beallitas_menu');
    const rangeInput = content.querySelector('input[type="range"]');
    expect(rangeInput).toBeNull();
  });

  test('a mentés gomb menti a beállításokat és alertet dob', async () => {
    await mod.beallitasMenuLetrehoz(0);
    document.querySelector('.gombok.center').click();
    await new Promise(process.nextTick);

    const mentesGomb = document.querySelector('button');
    mentesGomb.click();
    expect(window.alert).toHaveBeenCalledWith('Beállítások mentve!');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cachedSettings',
      expect.any(String)
    );
  });
});

describe('valtasFiok (Fiók fül)', () => {

  test('admin joggal rendelkező felhasználónál megjelenik az Admin panel gomb', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, usernev: 'admin', jog: 1 }));
    // Két fetch hívás
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { hangero: '0.5', nyelv_id: '1', kiosztas: '{}' },
      }),
    });
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: { username: 'Admin', user_email: 'admin@test.hu' },
      }),
    });

    await mod.beallitasMenuLetrehoz(1);
    const tabok = document.querySelectorAll('.gombok.center');
    tabok[1].click();
    await new Promise(process.nextTick);

    const adminGomb = [...document.querySelectorAll('button')].find(
      btn => btn.textContent === 'Admin panel'
    );
    expect(adminGomb).not.toBeNull();
  });
});