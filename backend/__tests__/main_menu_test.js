beforeAll(() => { //A play() nincsen a jest-ben és emiatt itt előtte le kell kezelni
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(undefined)
  });
});

jest.mock('../../frontend/javascript/index.js', () => ({
  fecthData: jest.fn(),
  oldalTakarito: jest.fn()
}));

jest.mock('../../frontend/javascript/bejelentkezes_regisztracio.js', () => ({
  modalLetrehoz: jest.fn()
}));

jest.mock('../../frontend/javascript/suti_modal.js', () => ({
  sutiModalKeszit: jest.fn()
}));

jest.mock('../../frontend/javascript/start_game.js', () => ({
  startGame: jest.fn()
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  volume: 0.5,
  nyelv: 'hu'
}));

jest.mock('../../frontend/javascript/credits.js', () => ({
  loadCredits: jest.fn()
}));

jest.mock('../../frontend/javascript/beallitas_menu.js', () => ({
  beallitasMenuLetrehoz: jest.fn()
}));

jest.mock('../../frontend/javascript/achivements.js', () => ({
  ShowAchivements: jest.fn()
}));

jest.mock('../../frontend/javascript/exit.js', () => ({}), { virtual: true });

const { createMainMenu } = require('../../frontend/javascript/main_menu.js');

const { fecthData, oldalTakarito } = require('../../frontend/javascript/index.js');
const { modalLetrehoz } = require('../../frontend/javascript/bejelentkezes_regisztracio.js');
const { sutiModalKeszit } = require('../../frontend/javascript/suti_modal.js');
const { startGame } = require('../../frontend/javascript/start_game.js');
const { beallitasMenuLetrehoz } = require('../../frontend/javascript/beallitas_menu.js');
const { ShowAchivements } = require('../../frontend/javascript/achivements.js');
const { loadCredits } = require('../../frontend/javascript/credits.js');

beforeEach(() => {
  document.body.innerHTML = '';

  localStorage.clear();

  jest.clearAllMocks();

  fecthData.mockResolvedValue({
    data: {
      title: 'Főmenü',
      music: ['Zene be', 'Zene ki'],
      login: 'Bejelentkezés',
      logout: 'Kijelentkezés',
      logoutConfirm: 'Biztosan kijelentkezel?',
      buttons: ['Játék indítása', 'Beállítások', 'Eredmények', 'Készítők', 'Kilépés']
    }
  });

  modalLetrehoz.mockResolvedValue(document.createElement('div'));
});

describe('createMainMenu', () => {
  test('oldalTakarito fv. segítségével letisztítja az oldalt', async () => {
    await createMainMenu();
    expect(oldalTakarito).toHaveBeenCalledTimes(1);
  });

  test('A jelenlegi nyelvel (magyar) lehívja a menü JSON-jét', async () => {
    await createMainMenu();
    expect(fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/hu/main_menu.json'
    );
  });

  test('Létrehozza a zene helyét, ha nincs jelen', async () => {
    await createMainMenu();
    const audio = document.getElementById('zenemarad');
    expect(audio).toBeTruthy();
    expect(audio.tagName).toBe('AUDIO');
    expect(audio.src).toContain('the_humbling_river.mp3');
    expect(audio.loop).toBe(true);
    expect(audio.muted).toBe(true);
  });

  test('Nem hoz létre új a zene helyet, ha már jelen van', async () => {
    const existingAudio = document.createElement('audio');
    existingAudio.id = 'zenemarad';
    document.body.appendChild(existingAudio);

    await createMainMenu();
    const audioElements = document.querySelectorAll('audio');
    expect(audioElements.length).toBe(1);
    expect(audioElements[0]).toBe(existingAudio);
  });

  test('Zene be és kikapcsoló gomb létrehozása', async () => {
    await createMainMenu();
    const musicBtn = document.getElementById('zeneGomb');
    expect(musicBtn).toBeTruthy();
    expect(musicBtn.textContent).toBe('Zene be');
  });

  test('Zene tényleges be- és kikapcsolása', async () => {
    await createMainMenu();
    const audio = document.getElementById('zenemarad');
    const musicBtn = document.getElementById('zeneGomb');

    expect(audio.muted).toBe(true);
    expect(musicBtn.textContent).toBe('Zene be');

    musicBtn.click();
    expect(audio.muted).toBe(false);
    expect(musicBtn.textContent).toBe('Zene ki');

    musicBtn.click();
    expect(audio.muted).toBe(true);
    expect(musicBtn.textContent).toBe('Zene be');
  });

  test('Hangerő kezelés', async () => {
    await createMainMenu();
    const audio = document.getElementById('zenemarad');
    audio.volume = 0.5;

    const event = new CustomEvent('hangeroValtozas', { detail: { volume: 0.8 } });
    window.dispatchEvent(event);
    expect(audio.volume).toBe(0.8);

    window.dispatchEvent(new CustomEvent('hangeroValtozas', { detail: { volume: 2 } }));
    expect(audio.volume).toBe(1);

    window.dispatchEvent(new CustomEvent('hangeroValtozas', { detail: { volume: -0.5 } }));
    expect(audio.volume).toBe(0);

    audio.volume = 0.5;
    window.dispatchEvent(new CustomEvent('hangeroValtozas', { detail: { volume: 'invalid' } }));
    expect(audio.volume).toBe(0.5);
  });

  test('Bejelentkezés gomb létrehozása', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));

    await createMainMenu();
    const authContainer = document.getElementById('authContainer');
    expect(authContainer).toBeTruthy();
    const loginBtn = authContainer.querySelector('button');
    expect(loginBtn.textContent).toBe('Bejelentkezés');
  });

  test('login ablak megnyitása, ha rányomunk', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));
    const mockModal = document.createElement('div');
    mockModal.style.display = 'none';
    modalLetrehoz.mockResolvedValue(mockModal);

    await createMainMenu();
    const loginBtn = document.querySelector('#authContainer button');
    await loginBtn.click();

    expect(modalLetrehoz).toHaveBeenCalledTimes(1);
    expect(mockModal.style.display).toBe('flex');
  });

  test('Kijelentkezés gomb kezelés, ha be vagyunk jelentkezve', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, usernev: 'player1', jog: 1 }));

    await createMainMenu();
    const logoutBtn = document.querySelector('#authContainer button');
    expect(logoutBtn.textContent).toBe('Kijelentkezés');
  });

  test('Visszajelzés és visszaállítás guest-re kijelentkezéskor', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, usernev: 'player1', jog: 1 }));
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    await createMainMenu();
    const logoutBtn = document.querySelector('#authContainer button');
    logoutBtn.click();

    expect(confirmSpy).toHaveBeenCalledWith('Biztosan kijelentkezel?');
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'authChanged',
        detail: { loggedIn: false }
      })
    );

    confirmSpy.mockRestore();
  });

  test('Kijelentkezés megszakítása', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 1, usernev: 'player1', jog: 1 }));
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    await createMainMenu();
    const logoutBtn = document.querySelector('#authContainer button');
    logoutBtn.click();

    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 1, usernev: 'player1', jog: 1 }));
    confirmSpy.mockRestore();
  });

  test('A menü fő gombjait létrehozza és teszteli', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));

    await createMainMenu();
    const menuButtons = document.querySelectorAll('.menu-gomb');
    expect(menuButtons.length).toBe(5);

    const buttonTexts = Array.from(menuButtons).map(btn => btn.textContent);
    expect(buttonTexts).toEqual([
      'Játék indítása',
      'Beállítások',
      'Eredmények',
      'Készítők',
      'Kilépés'
    ]);

    menuButtons[0].click();
    expect(startGame).toHaveBeenCalledTimes(1);

    menuButtons[1].click();
    expect(beallitasMenuLetrehoz).toHaveBeenCalledTimes(1);

    menuButtons[2].click();
    expect(ShowAchivements).toHaveBeenCalledTimes(1);

    menuButtons[3].click();
    expect(loadCredits).toHaveBeenCalledTimes(1);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    menuButtons[4].click();
    expect(consoleSpy).toHaveBeenCalledWith('Kilépés');
    consoleSpy.mockRestore();
  });

  test('A menü dolgait felrakja a body-ba', async () => {
    await createMainMenu();
    expect(document.getElementById('menu')).toBeTruthy();
    expect(document.getElementById('menu-cim').textContent).toBe('Főmenü');
    expect(document.querySelector('.menu-gomb')).toBeTruthy();
    expect(document.getElementById('zeneGomb')).toBeTruthy();
    expect(document.getElementById('authContainer')).toBeTruthy();
  });

  test('Meghívja a sutiModalKeszitet', async () => {
    await createMainMenu();
    expect(sutiModalKeszit).toHaveBeenCalledTimes(1);
  });

  test('Újratölti magát az autentikáció, amikor megváltozik az értéke', async () => {
    await createMainMenu();
    jest.clearAllMocks();  

    window.dispatchEvent(new CustomEvent('authChanged'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(oldalTakarito).toHaveBeenCalled();
  });
});

describe('DOMContentLoaded listener', () => {
  test('Meghívja a createMainMenu ha megvan a DOMContentLoaded', async () => {
    oldalTakarito.mockClear();
    fecthData.mockClear();

    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(oldalTakarito).toHaveBeenCalled();
  });
});

describe('Segítő function', () => {
  test('setGuestUser jól beállít minket guest usernek', () => {
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    const setGuest = () => {
      localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));
    };
    setGuest();
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      id: 0,
      usernev: 'guest',
      jog: 2
    });
  });
});