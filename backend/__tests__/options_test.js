
describe('options', () => {
  beforeEach(() => {
    jest.resetModules();           
    window.localStorage.clear();  
  });

  test('alapértelmezett értékek, ha nincs localStorage', () => {
    const { settings } = require('../../frontend/javascript/options');

    expect(settings.volume).toBe(0.5);
    expect(settings.mobileMode).toBe(false);
    expect(settings.controls).toEqual({
      forward: 'd',
      back: 'a',
      jump: 'space',
      attack: 'left click',
      interact: 'e',
    });
    expect(settings.nyelv).toBe(1);
  });

  test('nyelv a localStorage-ból', () => {
    window.localStorage.setItem('nyelv', 'hu');
    const { settings } = require('../../frontend/javascript/options');

    expect(settings.nyelv).toBe('hu');
  });

  test('nyelv alapértelmezett 1, ha a localStorage üres string', () => {
    window.localStorage.setItem('nyelv', '');
    const { settings } = require('../../frontend/javascript/options');

    expect(settings.nyelv).toBe(1);
  });

  test('irNyelv() frissíti a nyelv beállítást', () => {
    const { settings, irNyelv } = require('../../frontend/javascript/options');

    expect(settings.nyelv).toBe(1);
    irNyelv('hu');
    expect(settings.nyelv).toBe('hu');
  });

  test('többszöri modulbetöltés után is működik az irNyelv', () => {
    window.localStorage.setItem('nyelv', '2');
    const first = require('../../frontend/javascript/options');
    expect(first.settings.nyelv).toBe('2');

    jest.resetModules();
    const second = require('../../frontend/javascript/options');
    expect(second.settings.nyelv).toBe('2');

    second.irNyelv('en');
    expect(second.settings.nyelv).toBe('en');
  });
});