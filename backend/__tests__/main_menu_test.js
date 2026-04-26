beforeAll(() => { //A play() nincsen a jest-ben és emiatt itt előtte le kell kezelni
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(undefined)
  });
});

import { createMainMenu, renderAuthButton, zeneLetrehoz } from '../../frontend/javascript/main_menu.js';
import * as fetchModule from '../../frontend/javascript/index.js';
import * as modalModule from '../../frontend/javascript/bejelentkezes_regisztracio.js';
import * as sutiModule from '../../frontend/javascript/suti_modal.js';
import * as startGameModule from '../../frontend/javascript/start_game.js';
import * as optionsModule from '../../frontend/javascript/options.js';
import * as creditsModule from '../../frontend/javascript/credits.js';
import * as beallitasModule from '../../frontend/javascript/beallitas_menu.js';
import * as achievementsModule from '../../frontend/javascript/achivements.js';

jest.mock('../../frontend/javascript/index.js', () => ({
  fecthData: jest.fn(),
  oldalTakarito: jest.fn(),
}));

jest.mock('../../frontend/javascript/bejelentkezes_regisztracio.js', () => ({
  modalLetrehoz: jest.fn(),
}));

jest.mock('../../frontend/javascript/suti_modal.js', () => ({
  sutiModalKeszit: jest.fn(),
}));

jest.mock('../../frontend/javascript/start_game.js', () => ({
  startGame: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    nyelv: 'en',
    volume: 0.5,
  },
}));

jest.mock('../../frontend/javascript/credits.js', () => ({
  loadCredits: jest.fn(),
}));

jest.mock('../../frontend/javascript/beallitas_menu.js', () => ({
  beallitasMenuLetrehoz: jest.fn(),
}));

jest.mock('../../frontend/javascript/achivements.js', () => ({
  ShowAchivements: jest.fn(),
}));

jest.mock('../../frontend/javascript/exit.js', () => ({}), { virtual: true });


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

describe('createMainMenu', () => {
  const mockData = {
    data: {
      title: 'Főmenü',
      buttons: ['Start', 'Beállítások', 'Achievements', 'Credits', 'Kilépés'],
      login: 'Bejelentkezés',
      logout: 'Kijelentkezés',
      logoutConfirm: 'Biztosan kijelentkezik?',
      music: ['Zene ki', 'Zene be'],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = ''; // tiszta DOM
    localStorage.clear();

    // Alapértelmezett felhasználó (guest)
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 0, usernev: 'guest', jog: 2 })
    );

    fetchModule.fecthData.mockResolvedValue(mockData);
    modalModule.modalLetrehoz.mockResolvedValue(document.createElement('div'));
    sutiModule.sutiModalKeszit.mockResolvedValue();
  });

  test('meghívja az oldalTakarito függvényt és lekéri a nyelvi adatokat', async () => {
    await createMainMenu();

    expect(fetchModule.oldalTakarito).toHaveBeenCalled();
    expect(fetchModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/en/main_menu.json'
    );
  });

  test('ha nincs #zenemarad, létrehozza a zene audio elemet a megfelelő beállításokkal', async () => {
    await createMainMenu();

    const audio = document.getElementById('zenemarad');
    expect(audio).not.toBeNull();
    expect(audio.src).toContain('http://localhost/audio/the_humbling_river.mp3');
    expect(audio.loop).toBe(true);
    expect(audio.autoplay).toBe(true);
    expect(audio.muted).toBe(true);
    expect(audio.preload).toBe('auto');
    expect(audio.id).toBe('zenemarad');
    expect(audio.volume).toBe(0.5);
  });

  test('ha már létezik #zenemarad, nem hoz létre újat', async () => {
    const existingAudio = document.createElement('audio');
    existingAudio.id = 'zenemarad';
    document.body.appendChild(existingAudio);

    await createMainMenu();

    expect(document.getElementById('zenemarad')).toBe(existingAudio);
    const audioElements = document.querySelectorAll('audio');
    expect(audioElements.length).toBe(1);
  });

  test('Zene tényleges be- és kikapcsolása', async () => {
    await createMainMenu();

    const zeneGomb = document.getElementById('zeneGomb');
    expect(zeneGomb).not.toBeNull();
    expect(zeneGomb.textContent).toBe('Zene ki'); // mert music[0]

    const audio = document.getElementById('zenemarad');
    expect(audio.muted).toBe(true);
    const playSpy = jest.spyOn(audio, 'play');

    zeneGomb.click();
    expect(audio.muted).toBe(false);
    expect(playSpy).toHaveBeenCalled();
    expect(zeneGomb.textContent).toBe('Zene be');

    zeneGomb.click();
    expect(audio.muted).toBe(true);
    expect(zeneGomb.textContent).toBe('Zene ki');

    playSpy.mockRestore();
  });

  test('a hangerő változtatás eseményre frissíti a zene hangerejét', async () => {
    await createMainMenu();

    const audio = document.getElementById('zenemarad');
    window.dispatchEvent(
      new CustomEvent('hangeroValtozas', { detail: { volume: 0.8 } })
    );
    expect(audio.volume).toBe(0.8);

    audio.volume = 0.5; 
    window.dispatchEvent(
      new CustomEvent('hangeroValtozas', { detail: { volume: 'abc' } })
    );
    expect(audio.volume).toBe(0.5); 
  });

  describe('authContainer – bejelentkezés / kijelentkezés', () => {
    test('guest felhasználó esetén a "Bejelentkezés" gomb jelenik meg', async () => {
      await createMainMenu();
      const container = document.getElementById('authContainer');
      expect(container.innerHTML).toContain('Bejelentkezés');
      const loginBtn = container.querySelector('button');
      expect(loginBtn).not.toBeNull();
      expect(loginBtn.textContent).toBe('Bejelentkezés');
    });

    test('a bejelentkezés gombra kattintva megjelenik a modal', async () => {
      const fakeModal = document.createElement('div');
      fakeModal.style.display = 'none';
      modalModule.modalLetrehoz.mockResolvedValue(fakeModal);

      await createMainMenu();
      const loginBtn = document.querySelector('#authContainer button');
      await loginBtn.click();

      expect(modalModule.modalLetrehoz).toHaveBeenCalled();
      expect(fakeModal.style.display).toBe('flex');
    });

    test('bejelentkezett felhasználó esetén a "Kijelentkezés" gomb jelenik meg', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ id: 1, usernev: 'teszt', jog: 1 })
      );

      await createMainMenu();
      const container = document.getElementById('authContainer');
      const logoutBtn = container.querySelector('button');
      expect(logoutBtn).not.toBeNull();
      expect(logoutBtn.textContent).toBe('Kijelentkezés');
    });

    test('a kijelentkezés gombra kattintva confirm jelenik meg, és ha igaz, guest lesz a felhasználó', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ id: 1, usernev: 'teszt', jog: 1 })
      );
      window.confirm = jest.fn(() => true);

      await createMainMenu();
      const logoutBtn = document.querySelector('#authContainer button');
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      await logoutBtn.click();

      expect(window.confirm).toHaveBeenCalledWith('Biztosan kijelentkezik?');

      const raw = localStorage.getItem('user');
      const user = JSON.parse(raw);
      expect(user.id).toBe(0);
      expect(user.usernev).toBe('guest');

      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'authChanged',
          detail: { loggedIn: false },
        })
      );

      const updatedContainer = document.getElementById('authContainer');
      const newBtn = updatedContainer.querySelector('button');
      expect(newBtn.textContent).toBe('Bejelentkezés');
    });

    test('ha a confirm false, akkor nem történik kijelentkezés', async () => {
      localStorage.setItem(
        'user',
        JSON.stringify({ id: 1, usernev: 'teszt', jog: 1 })
      );
      window.confirm = jest.fn(() => false);

      await createMainMenu();
      const logoutBtn = document.querySelector('#authContainer button');
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      await logoutBtn.click();

      expect(window.confirm).toHaveBeenCalled();
      const raw = localStorage.getItem('user');
      const user = JSON.parse(raw);
      expect(user.id).toBe(1);
      expect(dispatchSpy).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'authChanged' })
      );
      const container = document.getElementById('authContainer');
      expect(container.innerHTML).toContain('Kijelentkezés');
    });
  });

  test('létrehozza a menü címet és gombokat, a kattintáseseményekkel', async () => {
    await createMainMenu();

    const title = document.getElementById('menu-cim');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Főmenü');

    const gombok = document.querySelectorAll('.menu-gomb');
    expect(gombok.length).toBe(5);

    expect(gombok[0].textContent).toBe('Start');
    expect(gombok[1].textContent).toBe('Beállítások');
    expect(gombok[2].textContent).toBe('Achievements');
    expect(gombok[3].textContent).toBe('Credits');
    expect(gombok[4].textContent).toBe('Kilépés');

    gombok[0].click();
    expect(startGameModule.startGame).toHaveBeenCalled();

    gombok[1].click();
    expect(beallitasModule.beallitasMenuLetrehoz).toHaveBeenCalledWith(0);

    gombok[2].click();
    expect(achievementsModule.ShowAchivements).toHaveBeenCalled();

    gombok[3].click();
    expect(creditsModule.loadCredits).toHaveBeenCalled();

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    gombok[4].click();
    expect(consoleSpy).not.toHaveBeenCalledWith('Ismeretlen gomb');
    consoleSpy.mockRestore();
  });

  test('meghívja a sutiModalKeszit-et', async () => {
    await createMainMenu();
    expect(sutiModule.sutiModalKeszit).toHaveBeenCalled();
  });
});