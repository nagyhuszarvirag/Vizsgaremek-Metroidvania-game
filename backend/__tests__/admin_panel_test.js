import { adminPanelLetrehoz } from '../../frontend/javascript/admin_panel.js';
import * as indexModule from '../../frontend/javascript/index.js';
import * as optionsModule from '../../frontend/javascript/options.js';

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
    controls: {},
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

global.fetch = jest.fn();

window.alert = jest.fn();
window.confirm = jest.fn();
window.dispatchEvent = jest.fn();

const szovegData = {
  data: {
    title: 'Admin Panel',
    usersTab: 'Felhasználók',
    resetTab: 'Jelszó visszaállítási kérelmek',
    mentes: 'Mentés',
    torles: 'Törlés',
    alert: 'Sikeres mentés!',
    confirm: 'Biztosan törlöd?',
    resetPass: 'Jelszó visszaállítása',
    resetSuc: 'Jelszó visszaállítva.',
    vissza: 'Vissza',
    id: 'ID',
    users: 'Felhasználónév',
    email: 'Email',
    jog: 'Jogosultság',
    muveletek: 'Műveletek',
    hiba: ['Hiba történt a felhasználók betöltésekor.', 'Hiba történt a kérelmek betöltésekor.'],
    reqId: 'Kérés ID',
    datum: 'Dátum',
    allapot: 'Állapot',
    uj: 'Új',
    resetelve: 'Visszaállítva',
  },
};

const mockVisszaGomb = document.createElement('button');
mockVisszaGomb.textContent = 'Vissza';
const mockDekorVonal = document.createElement('hr');

beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';

  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({ id: 0, usernev: 'guest', jog: 2 }));
  indexModule.fecthData.mockResolvedValue(szovegData);
  indexModule.visszaGomb.mockReturnValue(mockVisszaGomb.cloneNode(true));
  indexModule.dekor_vonal_blokkal.mockReturnValue(mockDekorVonal.cloneNode(true));
});

describe('adminPanelLetrehoz', () => {
  test('Betölti az admin panelt', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: [],
      }),
    });

    await adminPanelLetrehoz();

    const container = document.querySelector('.beallitas_menu');
    expect(container).not.toBeNull();

    // Title
    const h1 = container.querySelector('h1');
    expect(h1.textContent).toBe('Admin Panel');

    // Two tab buttons
    const buttons = container.querySelectorAll('.gombok');
    // The first two are the tab buttons, then the table buttons
    expect(buttons.length).toBeGreaterThanOrEqual(2);
    expect(buttons[0].textContent).toBe('Felhasználók');
    expect(buttons[1].textContent).toBe('Jelszó visszaállítási kérelmek');
  });

  test('oldaltakarito hívása és fordítások lekérése', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await adminPanelLetrehoz();

    expect(indexModule.oldalTakarito).toHaveBeenCalled();
    expect(indexModule.fecthData).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/admin_panel.json'
    );
  });

  test('adatok betöltése és tábla feltöltése', async () => {
    const mockUsers = [
      { user_id: 1, username: 'admin', user_email: 'admin@test.com', user_jog_id: 1 },
      { user_id: 2, username: 'user2', user_email: 'user2@test.com', user_jog_id: 2 },
    ];

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: mockUsers,
      }),
    });

    await adminPanelLetrehoz();

    const table = document.querySelector('table');
    expect(table).not.toBeNull();

    const rows = table.querySelectorAll('tr');
    expect(rows.length).toBe(3);
    const firstRow = rows[1];
    const cells = firstRow.querySelectorAll('td');
    expect(cells[0].textContent).toBe('1'); 
    expect(cells[1].querySelector('input').value).toBe('admin'); 
    expect(cells[2].querySelector('input').value).toBe('admin@test.com'); 
    expect(cells[3].querySelector('input').value).toBe('1'); 

    const opsButtons = cells[4].querySelectorAll('button');
    expect(opsButtons[0].textContent).toBe('Mentés');
    expect(opsButtons[1].textContent).toBe('Törlés');
  });

  test('Hiba esetén megjelenik a hibaüzenet', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
    });

    await adminPanelLetrehoz();

    const container = document.querySelector('.beallitas_menu');
    expect(container.textContent).toBe('Hiba történt a felhasználók betöltésekor.Vissza');
  });

  test('Mentés és a PATCH kérés', async () => {
    const mockUsers = [
      { user_id: 1, username: 'admin', user_email: 'admin@test.com', user_jog_id: 1 },
    ];

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: mockUsers,
      }),
    });

    await adminPanelLetrehoz();

    const usernameInput = document.querySelector('td input');
    usernameInput.value = 'newadmin';
    const emailInput = document.querySelectorAll('td input')[1];
    emailInput.value = 'new@test.com';
    const jogInput = document.querySelectorAll('td input')[2];
    jogInput.value = '2';

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    const saveBtn = document.querySelector('td button');
    saveBtn.click();
    await new Promise(process.nextTick);

    expect(global.fetch).toHaveBeenCalledTimes(2); 
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://127.0.0.1:3000/api/user/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({
          username: 'newadmin',
          user_email: 'new@test.com',
          user_jog_id: '2',
        }),
      })
    );
    expect(window.alert).toHaveBeenCalledWith('Sikeres mentés!');
  });

  test('Törlés és a DELETE kérés', async () => {
    window.confirm.mockReturnValue(true);
    const mockUsers = [
      { user_id: 5, username: 'todelete', user_email: 'del@test.com', user_jog_id: 2 },
    ];

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        data: mockUsers,
      }),
    });

    await adminPanelLetrehoz();

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    const deleteBtn = document.querySelectorAll('td button')[1];
    deleteBtn.click();
    await new Promise(process.nextTick);

    expect(window.confirm).toHaveBeenCalledWith('Biztosan törlöd?');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/user/5',
      { method: 'DELETE' }
    );

    expect(indexModule.fecthData).toHaveBeenCalledTimes(2); 
  });

  test('Törlés megszakítása', async () => {
    window.confirm.mockReturnValue(false);
    const mockUsers = [
      { user_id: 5, username: 'todelete', user_email: 'del@test.com', user_jog_id: 2 },
    ];

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockUsers }),
    });

    await adminPanelLetrehoz();
    const deleteBtn = document.querySelectorAll('td button')[1];
    deleteBtn.click();

    expect(window.confirm).toHaveBeenCalledWith('Biztosan törlöd?');
    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/api/user/5'),
      { method: 'DELETE' }
    );
  });

  test('Törli a kérést', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await adminPanelLetrehoz();

    const mockRequests = [
      {
        keres_id: 10,
        user_email: 'user@test.com',
        keres_datum: '2025-04-26T12:00:00Z',
        allapot: 0,
      },
    ];
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockRequests }),
    });

    const resetTab = document.querySelectorAll('.gombok')[1];
    resetTab.click();
    await new Promise(process.nextTick);

    const table = document.querySelector('table');
    expect(table).not.toBeNull();
    const rows = table.querySelectorAll('tr');
    expect(rows.length).toBe(2);
    const dataRow = rows[1];
    expect(dataRow.querySelector('td').textContent).toBe('10');
    expect(dataRow.querySelectorAll('td')[1].textContent).toBe('user@test.com');

    const statusCell = dataRow.querySelectorAll('td')[3];
    expect(statusCell.textContent).toBe('Új');
    expect(statusCell.style.color).toBe('orange');

    const resetBtn = dataRow.querySelector('button');
    expect(resetBtn.textContent).toBe('Jelszó visszaállítása');
  });

  test('A jelszó visszaállítás folyamata', async () => {
    window.confirm.mockReturnValue(true);
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await adminPanelLetrehoz();

    const mockRequests = [
      {
        keres_id: 10,
        user_email: 'user@test.com',
        keres_datum: '2025-04-26T12:00:00Z',
        allapot: 0,
      },
    ];
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockRequests }),
    });

    const resetTab = document.querySelectorAll('.gombok')[1];
    resetTab.click();
    await new Promise(process.nextTick);

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        tempPassword: 'Temp123!',
      }),
    });

    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    const resetBtn = document.querySelector('td button');
    resetBtn.click();
    await new Promise(process.nextTick);

    expect(window.confirm).toHaveBeenCalledWith('Biztos visszaállítod a jelszót?');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/admin/reset-jelszo',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ email: 'user@test.com', keres_id: 10 }),
      })
    );
    expect(window.alert).toHaveBeenCalledWith(
      'Jelszó visszaállítva.\nIdeiglenes jelszó: Temp123!'
    );
  });

  test('A jelszó visszaállítása sikertelen kezelése', async () => {
    window.confirm.mockReturnValue(true);
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await adminPanelLetrehoz();

    const mockRequests = [{
      keres_id: 10,
      user_email: 'user@test.com',
      keres_datum: '2025-04-26T12:00:00Z',
      allapot: 0,
    }];
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: mockRequests }),
    });

    const resetTab = document.querySelectorAll('.gombok')[1];
    resetTab.click();
    await new Promise(process.nextTick);

    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Valami hiba',
      }),
    });

    const resetBtn = document.querySelector('td button');
    resetBtn.click();
    await new Promise(process.nextTick);

    expect(window.alert).toHaveBeenCalledWith('Valami hiba');
  });

  test('visszaGomb van legalul', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, data: [] }),
    });

    await adminPanelLetrehoz();

    expect(indexModule.visszaGomb).toHaveBeenCalledWith('Vissza');
    const container = document.querySelector('.beallitas_menu');
    const lastElement = container.lastChild;
    expect(lastElement.tagName).toBe('BUTTON');
    expect(lastElement.textContent).toBe('Vissza');
  });
});