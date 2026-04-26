import { modalLetrehoz } from '../../frontend/javascript/bejelentkezes_regisztracio.js';
import * as indexModule from '../../frontend/javascript/index.js';
import * as optionsModule from '../../frontend/javascript/options.js';

jest.mock('../../frontend/javascript/index.js', () => ({
  fecthData: jest.fn(),
}));

jest.mock('../../frontend/javascript/options.js', () => ({
  settings: {
    nyelv: 'en',
    volume: 0.5,
  },
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
window.dispatchEvent = jest.fn();

const mockDataNyelv = {
  data: {
    loginInput: [
      'Bejelentkezés',
      'Felhasználónév',
      'Jelszó',
      'Belépés',
    ],
    logToReg: ['Nincs fiókod?', 'Regisztrálj'],
    regInput: [
      'Regisztráció',
      'Email cím',
      'Felhasználónév',
      'Jelszó',
      'Regisztráció',
    ],
    regToLog: ['Van már fiókod?', 'Jelentkezz be'],
    pasReq: [
      'Legalább 8 karakter',
      'Legalább egy nagybetű',
      'Legalább egy szám',
      'Legalább egy speciális karakter',
    ],
    loginAlert: [
      'Minden mező kitöltése kötelező!',
      'Sikeres bejelentkezés!',
    ],
    regAlert: [
      'Minden mező kitöltése kötelező!',
      'Sikeres regisztráció!',
      'Formátum nem megfelelő!',
      'A jelszó nem felel meg a követelményeknek!',
    ],
    forgotPass: 'Elfelejtett jelszó',
    forgotTitle: 'Elfelejtett jelszó',
    forgotSend: 'Küldés',
    forgotClose: 'Bezárás',
    forgotAlert: 'Adj meg egy email címet!',
    changeTitle: 'Jelszó megváltoztatása',
    changeInput: ['Új jelszó', 'Új jelszó mégegyszer', 'Mentés'],
    changeAlert: [
      'Minden mező kitöltése kötelező!',
      'A két jelszó nem egyezik!',
    ],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  localStorage.clear();

  indexModule.fecthData.mockResolvedValue(mockDataNyelv);
  global.fetch.mockClear();
  window.alert.mockClear();
  window.dispatchEvent.mockClear();
});

describe('modalLetrehoz', () => {
  test('létrehozza a modalt és visszaadja a DOM elemet', async () => {
    const modal = await modalLetrehoz();
    expect(modal).toBeInstanceOf(HTMLElement);
    expect(modal.id).toBe('authModal');
    expect(modal.style.display).toBe('none');
  });

  test('a bejelentkező űrlap mezői megfelelnek a nyelvi adatoknak', async () => {
    const modal = await modalLetrehoz();
    const loginUser = modal.querySelector('input[placeholder="Felhasználónév"]');
    const loginPass = modal.querySelector('input[placeholder="Jelszó"]');
    expect(loginUser).not.toBeNull();
    expect(loginPass).not.toBeNull();

    const h2 = modal.querySelector('h2');
    expect(h2.textContent).toBe('Bejelentkezés');

    const button = modal.querySelector('button');
    expect(button.textContent).toBe('Belépés');
  });

  test('a regisztrációs űrlap mezői és jelszó követelmények megjelennek', async () => {
    const modal = await modalLetrehoz();


    const registerDiv = modal.querySelector('div[style*="display: none"]');
    expect(registerDiv).not.toBeNull();


    const regH2 = registerDiv.querySelector('h2');
    expect(regH2.textContent).toBe('Regisztráció');

    const reqItems = registerDiv.querySelectorAll('[data-regex]');
    expect(reqItems.length).toBe(4);
    expect(reqItems[0].textContent).toBe('Legalább 8 karakter');
    expect(reqItems[1].textContent).toBe('Legalább egy nagybetű');
    expect(reqItems[2].textContent).toBe('Legalább egy szám');
    expect(reqItems[3].textContent).toBe('Legalább egy speciális karakter');
  });

  test('bejelentkezés gomb sikeres válasz esetén localStorage-t ment és authChanged eseményt küld', async () => {
    const modal = await modalLetrehoz();

    const loginUser = modal.querySelector('input[placeholder="Felhasználónév"]');
    const loginPass = modal.querySelector('input[placeholder="Jelszó"]');
    loginUser.value = 'testuser';
    loginPass.value = 'testpass';

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        userId: 5,
        usernev: 'testuser',
        userJogId: 1,
        jelszoCsereKotelezo: false,
      }),
    });

    const loginGomb = modal.querySelector('button');
    loginGomb.click();


    await new Promise(process.nextTick);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ id: 5, usernev: 'testuser', jog: 1 }),
    );
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'authChanged',
        detail: { loggedIn: true },
      }),
    );
    expect(modal.style.display).toBe('none');
    expect(window.alert).toHaveBeenCalledWith('Sikeres bejelentkezés!');
  });

  test('sikertelen bejelentkezés esetén alert a hibaüzenettel', async () => {
    const modal = await modalLetrehoz();

    const loginUser = modal.querySelector('input[placeholder="Felhasználónév"]');
    const loginPass = modal.querySelector('input[placeholder="Jelszó"]');
    loginUser.value = 'rossz';
    loginPass.value = 'rossz';

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Hibás felhasználónév vagy jelszó',
      }),
    });

    const loginGomb = modal.querySelector('button');
    loginGomb.click();
    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith('Hibás felhasználónév vagy jelszó');
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('elfelejtett jelszó modal megjelenik és eltűnik', async () => {
    const modal = await modalLetrehoz();

    const forgotPass = modal.querySelector('p');
    forgotPass.click(); 

    const modal2 = document.querySelector('div[style*="z-index: 10000"]');
    expect(modal2).not.toBeNull();

    const bezar = modal2.querySelector('button:last-of-type');
    expect(bezar.textContent).toBe('Bezárás');
    bezar.click();

    expect(document.body.contains(modal2)).toBe(false);
  });

  test('kötelező jelszócsere modal megjelenik és működik', async () => {
    const modal = await modalLetrehoz();

    const loginUser = modal.querySelector('input[placeholder="Felhasználónév"]');
    const loginPass = modal.querySelector('input[placeholder="Jelszó"]');
    loginUser.value = 'user1';
    loginPass.value = 'pass1';

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        userId: 7,
        usernev: 'user1',
        userJogId: 2,
        jelszoCsereKotelezo: true,
      }),
    });

    const loginGomb = modal.querySelector('button');
    loginGomb.click();
    await new Promise(process.nextTick);

    const modal3 = document.querySelector('div[style*="z-index: 10001"]');
    expect(modal3).not.toBeNull();

    const ujJelszo = modal3.querySelector('input[placeholder="Új jelszó"]');
    const ujJelszo2 = modal3.querySelector('input[placeholder="Új jelszó mégegyszer"]');
    ujJelszo.value = 'NewPass1!';
    ujJelszo2.value = 'NewPass1!';

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, message: 'Jelszó frissítve' }),
    });

    const mentes = modal3.querySelector('button');
    mentes.click();
    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith('Jelszó frissítve');
    expect(document.body.contains(modal3)).toBe(false);
  });

  test('a bezárás gomb elrejti a modalt és törli a mezőket', async () => {
    const modal = await modalLetrehoz();

    const close = modal.querySelector('span');
    close.click();

    expect(modal.style.display).toBe('none');

    const loginUser = modal.querySelector('input[placeholder="Felhasználónév"]');
    const loginPass = modal.querySelector('input[placeholder="Jelszó"]');
    expect(loginUser.value).toBe('');
    expect(loginPass.value).toBe('');
  });

});