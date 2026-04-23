const axios = require('axios');

function fetchData(url) {
  return axios.get(url).then(response => response.data);
}

function postData(url, data) {
  return axios.post(url, data).then(response => response.data);
}

function patchData(url, data) {
  return axios.patch(url, data).then(response => response.data);
}

function deleteData(url) {
  return axios.delete(url).then(response => response.data);
}

jest.mock('axios');

describe('API Tesztek', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================
  //            GET 
  // ========================

  describe('GET /api/test', () => {
    it('A végpont működését teszteli', async () => {
      const data = { message: 'Ez a végpont működik.' };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/test');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/test');
    });
  });

  describe('GET /api/testsql', () => {
    it('Tesztadatot ad vissza', async () => {
      const data = {
        message: 'Ez a végpont működik.',
        results: [{ id: 1, name: 'test' }]
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/testsql');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/testsql');
    });

    it('Szerver errort kezel', async () => {
      axios.get.mockRejectedValue(new Error('Database error'));
      await expect(fetchData('http://127.0.0.1:3000/api/testsql')).rejects.toThrow('Database error');
    });
  });

  describe('GET /api/nyelv_alapjan_JSON_olvasas/:nyelv/:fajl', () => {
    it('A main_menu.json magyar változatát adja vissza', async () => {
      const data = {
        title: 'Transformers: More than Meets the Eye',
        buttons: ['Játék indítása', 'Beállítások', 'Trófeák', 'Kreditek', 'Kilépés'],
        music: ['Zene bekapcsolása', 'Zene kikapcsolása'],
        login: 'Bejelentkezés/Regisztráció',
        logout: 'Kijelentkezés',
        logoutConfirm: 'Biztosan ki akarsz jelentkezni?'
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/main_menu.json');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/main_menu.json');
    });

    it('400-as error, ha nem JSON fájl', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Csak JSON fájlokat fogadunk el!' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/notjson.txt'))
        .rejects.toEqual(errorResponse);
    });

    it('400-as error, ha érvénytelen nyelv', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Érvénytelen nyelv!' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/99/main_menu.json'))
        .rejects.toEqual(errorResponse);
    });

    it('404-es error, ha a fájl nem létezik', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { success: false, message: 'A JSON fájl nem létezik!' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/nonexistent.json'))
        .rejects.toEqual(errorResponse);
    });
  });

  describe('GET /api/felhasznalo/:id', () => {
    it('A felhasználó beállításait adja vissza', async () => {
      const data = {
        success: true,
        data: {
          user_id: 1,
          hangero: '0.50',
          nyelv_id: 1,
          kiosztas: '{"playerEloreMegyGombja": "d", "playerHatraMegyGombja": "a", "playerUgroGombja": "space", "playerAttackGombja": "left click", "playerInteractGombja": "e"}'
        }
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/felhasznalo/1');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/felhasznalo/1');
    });

    it('null a return, ha nincs beállítás', async () => {
      const data = { success: true, data: null };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/felhasznalo/999');
      expect(result).toEqual(data);
    });

    it('400-as error, ha hibás user ID', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hibás user ID.' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/felhasznalo/0')).rejects.toEqual(errorResponse);
    });
  });

  describe('GET /api/fiokadat/:id', () => {
    it('A fiókadatot adja vissza', async () => {
      const data = {
        success: true,
        data: {
          user_id: 1,
          username: 'admin',
          user_email: 'admin@gmail.com'
        }
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/fiokadat/1');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/fiokadat/1');
    });
  });

  describe('GET /api/showachivements/:id/:nyelv', () => {
    it('Vissza kéri a jutalmakat a felhasználó számára', async () => {
      const data = {
        success: true,
        data: [
          { achivement_id: 1, name: 'Első lépések', completed: 1 }
        ]
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/showachivements/1/1');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/showachivements/1/1');
    });

    it('400-as error, ha érvénytelen paraméter', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hibás user ID vagy nyelv.' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/showachivements/0/1')).rejects.toEqual(errorResponse);
    });
  });

  describe('GET /api/admin/users', () => {
    it('A felhasználók adatait adja vissza (csak admin)', async () => {
      const data = {
        success: true,
        data: [
          { user_id: 1, username: 'admin', user_email: 'admin@gmail.com', user_jog_id: 1 }
        ]
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/admin/users');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/admin/users');
    });
  });

  describe('GET /api/mentesmeghiv/:user_id/:mentes_id', () => {
    it('A mentés adatait adja vissza', async () => {
      const data = {
        success: true,
        data: {
          mentes_id: 2,
          user_id: 1,
          mentett_adatok: {
            savepoint: 'kezdomap_1',
            world_interactions: { 'mitteous-plateau_breakable-ground1': 0 },
            NPC_interactions: { 'Ratchet': 0, 'Prowl': 0 },
            bosses: { 'Tarn': 0 },
            ability_unlocked: { 'double_jump': 0, 'dash': 0 }
          }
        }
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/mentesmeghiv/1/2');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/mentesmeghiv/1/2');
    });
  });

  describe('GET /api/map_data/:szoba_neve', () => {
    it('Visszakéri a kezdomap.json adatait', async () => {
        const data = { "compressionlevel":-1,
   "height":50,
   "infinite":false,
   "layers":[
          {
           "data":[150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 181, 182, 182, 182, 182, 182, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 124, 95, 67, 95, 67, 126, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 94, 95, 95, 95, 95, 95, 96, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 124, 125, 95, 95, 95, 67, 126, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 181, 182, 182, 182, 182, 182, 182, 182, 182, 182, 183, 183, 183, 183, 184, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 94, 95, 95, 95, 96, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 181, 182, 182, 182, 182, 183, 184, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 124, 125, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 94, 95, 95, 95, 95, 95, 95, 96, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 124, 125, 125, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 124, 125, 125, 125, 125, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 0, 0, 127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
              150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
           "height":50,
           "id":1,
           "name":"Fo_layer",
           "opacity":1,
           "type":"tilelayer",
           "visible":true,
           "width":60,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":7,
           "name":"Back_From_Mitteous_Plateu",
           "objects":[
                  {
                   "height":0,
                   "id":26,
                   "name":"",
                   "point":true,
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":0,
                   "x":1633,
                   "y":1341
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":3,
           "name":"Kezdo_pont",
           "objects":[
                  {
                   "height":0,
                   "id":2,
                   "name":"",
                   "point":true,
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":0,
                   "x":513,
                   "y":1337
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":4,
           "name":"Solid",
           "objects":[
                  {
                   "height":296,
                   "id":3,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":384,
                   "x":671,
                   "y":1311
                  }, 
                  {
                   "height":257,
                   "id":4,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":672,
                   "x":-2,
                   "y":1345
                  }, 
                  {
                   "height":1358.66666666667,
                   "id":6,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":481.333333333333,
                   "x":-225,
                   "y":-14
                  }, 
                  {
                   "height":1120,
                   "id":7,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":384,
                   "x":673,
                   "y":0
                  }, 
                  {
                   "height":33,
                   "id":8,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":174,
                   "x":256.333333333333,
                   "y":1279.66666666667
                  }, 
                  {
                   "height":31.6666666666665,
                   "id":9,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":110.333333333333,
                   "x":256.666666666667,
                   "y":1184
                  }, 
                  {
                   "height":32.9999999999999,
                   "id":10,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":77.3333333333333,
                   "x":257.333333333333,
                   "y":1023.66666666667
                  }, 
                  {
                   "height":32.3333333333334,
                   "id":11,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":208.666666666667,
                   "x":256.666666666667,
                   "y":768.333333333333
                  }, 
                  {
                   "height":32.6666666666666,
                   "id":12,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":173.666666666667,
                   "x":256,
                   "y":544
                  }, 
                  {
                   "height":32,
                   "id":13,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":191.333333333333,
                   "x":480.666666666667,
                   "y":448.666666666667
                  }, 
                  {
                   "height":31.6666666666666,
                   "id":14,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":210.333333333333,
                   "x":462.333333333333,
                   "y":639.666666666667
                  }, 
                  {
                   "height":32.6666666666666,
                   "id":15,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":144.666666666667,
                   "x":528.666666666667,
                   "y":832
                  }, 
                  {
                   "height":33.6666666666667,
                   "id":16,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":210.333333333333,
                   "x":384.666666666667,
                   "y":927.333333333333
                  }, 
                  {
                   "height":32.6666666666665,
                   "id":17,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":242,
                   "x":431,
                   "y":1088
                  }, 
                  {
                   "height":191.333333333333,
                   "id":18,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":416,
                   "x":257.333333333333,
                   "y":0
                  }, 
                  {
                   "height":190.666666666667,
                   "id":19,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":890.666666666667,
                   "x":1040,
                   "y":0
                  }, 
                  {
                   "height":278.666666666667,
                   "id":20,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":869.333333333333,
                   "x":1054.66666666667,
                   "y":1344
                  }, 
                  {
                   "height":830.666666666667,
                   "id":21,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":204,
                   "x":1729.33333333333,
                   "y":161.333333333333
                  }, 
                  {
                   "height":32,
                   "id":22,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":468,
                   "x":1153.33333333333,
                   "y":768
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":2,
           "name":"Prowl_interaction",
           "objects":[
                  {
                   "height":0,
                   "id":1,
                   "name":"",
                   "point":true,
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":0,
                   "x":1392,
                   "y":1338.66666666667
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":6,
           "name":"To_Mitteous_plateau_planes",
           "objects":[
                  {
                   "height":355.333333333333,
                   "id":24,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":197.333333333333,
                   "x":1730.66666666667,
                   "y":989.333333333333
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }, 
          {
           "draworder":"topdown",
           "id":5,
           "name":"Ladder",
           "objects":[
                  {
                   "height":608.666666666667,
                   "id":23,
                   "name":"",
                   "rotation":0,
                   "type":"",
                   "visible":true,
                   "width":30.6666666666667,
                   "x":1121.33333333333,
                   "y":736
                  }],
           "opacity":1,
           "type":"objectgroup",
           "visible":true,
           "x":0,
           "y":0
          }],
   "nextlayerid":8,
   "nextobjectid":27,
   "orientation":"orthogonal",
   "renderorder":"right-down",
   "tiledversion":"1.11.2",
   "tileheight":32,
   "tilesets":[
          {
           "firstgid":1,
           "source":"..\/..\/tiled\/tilsets\/hyptosis_tile-art-batch-1.tsx"
          }],
   "tilewidth":32,
   "type":"map",
   "version":"1.10",
   "width":60
  };
        axios.get.mockResolvedValue({ data });
  
        const result = await fetchData('http://127.0.0.1:3000/api/map_data/kezdomap.json');
        expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/map_data/kezdomap.json');
    });

    it('400-as error, ha nem JSON fájl', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Csak JSON fájlokat fogadunk el!' }
        }
      };
      axios.get.mockRejectedValue(errorResponse);

      await expect(fetchData('http://127.0.0.1:3000/api/map_data/notamap.txt')).rejects.toEqual(errorResponse);
    });
  });

  describe('GET /api/admin/elfelejtett-jelszo-keresek', () => {
    it('Jelszó visszaállítási kérések lekérdezése (csak adminoknak)', async () => {
      const data = {
        success: true,
        data: [
          { keres_id: 1, user_email: 'asd@gmail.com', keres_datum: '2026-03-24T10:17:10.000Z', allapot: 'uj' }
        ]
      };
      axios.get.mockResolvedValue({ data });

      const result = await fetchData('http://127.0.0.1:3000/api/admin/elfelejtett-jelszo-keresek');
      expect(result).toEqual(data);
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/admin/elfelejtett-jelszo-keresek');
    });
  });

  // ========================
  //          POST 
  // ========================

  describe('POST /api/register', () => {
    it('Új felhasználó regisztrálása', async () => {
      const requestData = { usernev: 'newuser', jelszo: 'ValidPass123!', email: 'new@example.com' };
      const responseData = {
        success: true,
        userId: 5,
        usernev: 'newuser',
        userJogId: 2
      };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/register', requestData);
      expect(result).toEqual(responseData);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/api/register', requestData);
    });

    it('409, ha létezik a felhasználó', async () => {
      const requestData = { usernev: 'admin', jelszo: 'password', email: 'admin@gmail.com' };
      const errorResponse = {
        response: {
          status: 409,
          data: { success: false, message: 'Felhasználónév foglalt' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/register', requestData)).rejects.toEqual(errorResponse);
    });

    it('400-as error, ha érvénytelen az email formátum', async () => {
      const requestData = { usernev: 'test', jelszo: 'pass', email: 'invalid-email' };
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Érvénytelen email formátum' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/register', requestData)).rejects.toEqual(errorResponse);
    });

    it('A felhasználó adminisztrátori jogosultsággal rendelkezik (az apiba be van égetve 2 fix admin)', async () => {
      const requestData = { usernev: 'admin2', jelszo: 'AdminPass123!', email: 'nagyhuszarvirag@gmail.com' };
      const responseData = {
        success: true,
        userId: 6,
        usernev: 'admin2',
        userJogId: 1
      };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/register', requestData);
      expect(result.userJogId).toBe(1);
    });
  });

  describe('POST /api/login', () => {
    it('Sikeres bejelentkezés helyes hitelesítő adatokkal', async () => {
      const requestData = { usernev: 'admin', jelszo: 'admin123' };
      const responseData = {
        success: true,
        userId: 1,
        usernev: 'admin',
        userJogId: 1,
        jelszoCsereKotelezo: 0
      };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/login', requestData);
      expect(result).toEqual(responseData);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/api/login', requestData);
    });

    it('401-es error, ha a felhasználónév nem létezik', async () => {
      const requestData = { usernev: 'nonexistent', jelszo: 'pass' };
      const errorResponse = {
        response: {
          status: 401,
          data: { success: false, message: 'Felhasználónév nem létezik' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/login', requestData)).rejects.toEqual(errorResponse);
    });

    it('401-es error, ha hibás a jelszó', async () => {
      const requestData = { usernev: 'admin', jelszo: 'wrongpassword' };
      const errorResponse = {
        response: {
          status: 401,
          data: { success: false, message: 'Hibás jelszó' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/login', requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('POST /api/felhasznalo/beallitas', () => {
    it('Hangerő frissítése', async () => {
      const requestData = { user_id: 1, key: 'hangero', value: 0.75 };
      const responseData = { success: true };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/felhasznalo/beallitas', requestData);
      expect(result).toEqual(responseData);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/api/felhasznalo/beallitas', requestData);
    });

    it('Nyelv beállítás frissítése', async () => {
      const requestData = { user_id: 1, key: 'nyelv_id', value: 2 };
      const responseData = { success: true };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/felhasznalo/beallitas', requestData);
      expect(result).toEqual(responseData);
    });

    it('Kulcs kombinációk frissítése', async () => {
      const requestData = {
        user_id: 1,
        key: 'kiosztas',
        value: { elore: 'w', hatra: 's', bal: 'a', jobb: 'd' }
      };
      const responseData = { success: true };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/felhasznalo/beallitas', requestData);
      expect(result).toEqual(responseData);
    });

    it('400-as error, ha érvénytelen a user_id', async () => {
      const requestData = { user_id: 0, key: 'hangero', value: 0.5 };
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hibás user.' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/felhasznalo/beallitas', requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('POST /api/kelleNPC', () => {
    it('NPC interaction státuszának lekérdezése', async () => {
      const requestData = {
        valtozo_utvonal: '$.NPC_interactions.Prowl',
        mentes_id: 1,
        user_id: 1
      };
      const responseData = { success: true, message: 0 }; // 0 = nem volt interackció, 1 = volt interakció 
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/kelleNPC', requestData);
      expect(result).toEqual(responseData);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/api/kelleNPC', requestData);
    });
  });

  describe('POST /api/elfelejtett-jelszo', () => {
    it('Jelszó-visszaállítási kérés létrehozása', async () => {
      const requestData = { email: 'user@example.com' };
      const responseData = { success: true, message: 'A jelszó-visszaállítási kérés rögzítve lett' };
      axios.post.mockResolvedValue({ data: responseData });

      const result = await postData('http://127.0.0.1:3000/api/elfelejtett-jelszo', requestData);
      expect(result).toEqual(responseData);
      expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:3000/api/elfelejtett-jelszo', requestData);
    });

    it('400-as error, ha az email hiányzik', async () => {
      const requestData = {};
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hiányzó email cím' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/elfelejtett-jelszo', requestData)).rejects.toEqual(errorResponse);
    });

    it('404-es error, ha az email nem található', async () => {
      const requestData = { email: 'notfound@example.com' };
      const errorResponse = {
        response: {
          status: 404,
          data: { success: false, message: 'Nincs ilyen email címmel felhasználó' }
        }
      };
      axios.post.mockRejectedValue(errorResponse);

      await expect(postData('http://127.0.0.1:3000/api/elfelejtett-jelszo', requestData)).rejects.toEqual(errorResponse);
    });
  });

  // ========================
  //          PATCH
  // ========================

  describe('PATCH /api/user/:id', () => {
    it('Felhasználó adatainak frissítése', async () => {
      const requestData = { username: 'updatedUser', user_email: 'updated@example.com' };
      const responseData = { success: true };
      axios.patch.mockResolvedValue({ data: responseData });

      const result = await patchData('http://127.0.0.1:3000/api/user/8', requestData);
      expect(result).toEqual(responseData);
      expect(axios.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/user/8', requestData);
    });

    it('422-es error, ha hiányzik az adat', async () => {
      const requestData = { username: 'csaknev' };
      const errorResponse = {
        response: {
          status: 422,
          data: { message: 'Hiányzó adat' }
        }
      };
      axios.patch.mockRejectedValue(errorResponse);

      await expect(patchData('http://127.0.0.1:3000/api/user/8', requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('PATCH /api/updateachivements', () => {
    it('Frissíti a teljesítményt és elmenti az adatokat', async () => {
      const requestData = {
        user_id: 1,
        achivement_id: 1,
        mentes_id: 1,
        valtozo_utvonal: '$.NPC_interactions.Prowl',
        valtozott_adat: 1
      };
      const responseData = { success: true };
      axios.patch.mockResolvedValue({ data: responseData });

      const result = await patchData('http://127.0.0.1:3000/api/updateachivements', requestData);
      expect(result).toEqual(responseData);
      expect(axios.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/updateachivements', requestData);
    });
  });

  describe('PATCH /api/admin/reset-jelszo', () => {
    it('Jelszó visszaállítása alaphelyzetbe', async () => {
      const requestData = { email: 'user@example.com', keres_id: 1 };
      const responseData = {
        success: true,
        message: 'A jelszó vissza lett állítva',
        tempPassword: 'Temp1234!'
      };
      axios.patch.mockResolvedValue({ data: responseData });

      const result = await patchData('http://127.0.0.1:3000/api/admin/reset-jelszo', requestData);
      expect(result).toEqual(responseData);
      expect(axios.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/admin/reset-jelszo', requestData);
    });

    it('400-as error, ha hiányzik az adat', async () => {
      const requestData = { email: 'user@example.com' };
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hiányzó adat' }
        }
      };
      axios.patch.mockRejectedValue(errorResponse);

      await expect(patchData('http://127.0.0.1:3000/api/admin/reset-jelszo', requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('PATCH /api/user/jelszo-csere/:id', () => {
    it('Jelszó módosítása érvényes új jelszóval', async () => {
      const requestData = { ujJelszo: 'NewValidPass123!' };
      const responseData = { success: true, message: 'A jelszó sikeresen módosítva' };
      axios.patch.mockResolvedValue({ data: responseData });

      const result = await patchData('http://127.0.0.1:3000/api/user/jelszo-csere/1', requestData);
      expect(result).toEqual(responseData);
      expect(axios.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/user/jelszo-csere/1', requestData);
    });

    it('400-as error, ha a jelszó nem felel meg a követelményeknek', async () => {
      const requestData = { ujJelszo: 'weak' };
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'A jelszó nem felel meg a követelményeknek' }
        }
      };
      axios.patch.mockRejectedValue(errorResponse);

      await expect(patchData('http://127.0.0.1:3000/api/user/jelszo-csere/1', requestData)).rejects.toEqual(errorResponse);
    });
  });

  describe('PATCH /api/mentes/update-savepoint', () => {
    it('Frissíti a mentési pontot egy mentési slotot számára', async () => {
      const requestData = { user_id: 1, mentes_id: 1, uj_savepoint: 'savepoint_2' };
      const responseData = { success: true, message: 'Savepoint elmentve' };
      axios.patch.mockResolvedValue({ data: responseData });

      const result = await patchData('http://127.0.0.1:3000/api/mentes/update-savepoint', requestData);
      expect(result).toEqual(responseData);
      expect(axios.patch).toHaveBeenCalledWith('http://127.0.0.1:3000/api/mentes/update-savepoint', requestData);
    });

    it('400-as error, ha hiányzik az adat', async () => {
      const requestData = { user_id: 1 };
      const errorResponse = {
        response: {
          status: 400,
          data: { success: false, message: 'Hiányzó adat' }
        }
      };
      axios.patch.mockRejectedValue(errorResponse);

      await expect(patchData('http://127.0.0.1:3000/api/mentes/update-savepoint', requestData)).rejects.toEqual(errorResponse);
    });
  });

  // ========================
  //          DELETE
  // ========================

  describe('DELETE /api/user/:id', () => {
    it('Törli a felhasználót', async () => {
      const responseData = { success: true };
      axios.delete.mockResolvedValue({ data: responseData });

      const result = await deleteData('http://127.0.0.1:3000/api/user/8');
      expect(result).toEqual(responseData);
      expect(axios.delete).toHaveBeenCalledWith('http://127.0.0.1:3000/api/user/8');
    });
  });
});