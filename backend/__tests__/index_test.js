// index.test.js
// Jest test file – requires jest-environment-jsdom and a babel setup for ES modules.
// (Axios is not needed for these tests; global fetch is mocked directly.)

import { 
  fecthData, 
  masikJSMeghivasa, 
  oldalTakarito, 
  visszaGomb, 
  dekor_vonal_blokkal 
} from '../../frontend/javascript/index.js';
import { createMainMenu } from '../../frontend/javascript/main_menu.js';

// Mock the dependency
jest.mock('../../frontend/javascript/main_menu.js', () => ({
  createMainMenu: jest.fn(),
}));

describe('fecthData', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Alap JSON-t ad vissza sikeres fetch esetén', async () => {
    const mockData = { success: true };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
      statusText: 'OK',
    });

    const result = await fecthData('https://api.example.com');
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
      body: null,
    });
  });

  it('Ha van body, azt JSON-ként küldi', async () => {
    const mockData = { id: 1 };
    const bodyObj = { name: 'test' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
      statusText: 'OK',
    });

    await fecthData('https://api.example.com', 'POST', bodyObj);
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(bodyObj),
    });
  });

  it('hiba a fetch hibás válaszával', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      json: jest.fn(),
    });

    await expect(fecthData('https://api.example.com')).rejects.toThrow('Not Found');
  });

  it('Hiba kiírása a: "Hiba: " résszel', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(fecthData('https://api.example.com')).rejects.toThrow('Hiba: Network error');
  });
});


describe('oldalTakarito', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('#zenemarad -on kívül mindent töröl', () => {
    const music = document.createElement('div');
    music.id = 'zenemarad';
    const other1 = document.createElement('div');
    const other2 = document.createElement('button');
    document.body.appendChild(other1);
    document.body.appendChild(music);
    document.body.appendChild(other2);

    oldalTakarito();

    expect(document.body.children.length).toBe(1);
    expect(document.body.children[0]).toBe(music);
    expect(music.id).toBe('zenemarad');
  });

  it('Nem szedi ki #zenemarad element-et', () => {
    const music = document.createElement('div');
    music.id = 'zenemarad';
    document.body.appendChild(music);
    const other = document.createElement('p');
    document.body.appendChild(other);

    oldalTakarito();

    expect(document.body.contains(music)).toBe(true);
  });

  it('Átírja body.innerHTML-t ""-re, ha #zenemarad nem létezik', () => {
    document.body.innerHTML = '<div>Hello</div><p>World</p>';

    oldalTakarito();

    expect(document.body.innerHTML).toBe('');
    expect(document.body.children.length).toBe(0);
  });

});

describe('visszaGomb', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Vissza gombot hoz létre a megfelelő szöveggel, osztályokkal és ID-val', () => {
    const button = visszaGomb('Back');

    expect(button.tagName).toBe('BUTTON');
    expect(button.innerText).toBe('Back');
    expect(button.classList.contains('gombok')).toBe(true);
    expect(button.id).toBe('vissza_gomb');
  });

  it('meghívja a createMainMenu függvényt, amikor rákattintanak', async () => {
    const mockedCreateMainMenu = createMainMenu;
    mockedCreateMainMenu.mockResolvedValue();

    const button = visszaGomb('Go');
    await button.click();

    expect(mockedCreateMainMenu).toHaveBeenCalledTimes(1);
  });

  it('különböző gombokat hoz létre', () => {
    const btn1 = visszaGomb('x');
    const btn2 = visszaGomb('y');
    expect(btn1).not.toBe(btn2);
  });
});

describe('dekor_vonal_blokkal', () => {
  it('visszaad egy div elemet a dekor vonal osztállyal', () => {
    const row = dekor_vonal_blokkal();

    expect(row.tagName).toBe('DIV');
    expect(row.classList.contains('row')).toBe(true);
    expect(row.classList.contains('dekor_vonal')).toBe(true);
  });

  it('tartalmaz három span elemet a megfelelő osztályokkal és szöveggel', () => {
    const row = dekor_vonal_blokkal();
    const spans = row.querySelectorAll('span');

    expect(spans.length).toBe(3);
    spans.forEach(span => {
      expect(span.classList.contains('kocka')).toBe(true);
      expect(span.innerText).toBe('■');
    });
  });

  it('Nem csatolja automatikusan a DOM-hoz', () => {
    const row = dekor_vonal_blokkal();
    expect(document.body.contains(row)).toBe(false);
  });

  it('Minden hívásnál új elemet ad vissza', () => {
    const row1 = dekor_vonal_blokkal();
    const row2 = dekor_vonal_blokkal();
    expect(row1).not.toBe(row2);
  });
});