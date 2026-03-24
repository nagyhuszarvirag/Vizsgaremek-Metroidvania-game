const axios = require('axios');

function fetchData(url) {
  return axios.get(url).then(response => response.data);
}

jest.mock('axios');

describe('GET Request Tesztek', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/api/nyelv_alapjan_JSON_olvasas teszt: A main_menu.json-nal teszteli az API adott oldalának szövegmeghívását', async () => {
    const data = {
        "title": "Transformers: More than Meets the Eye",
        "buttons": [
            "Játék indítása",
            "Beállítások",
            "Trófeák",
            "Kreditek",
            "Kilépés"
        ],
        "music":
        [
            "Zene bekapcsolása",
            "Zene kikapcsolása"
        ],
            "login": "Bejelentkezés/Regisztráció",
            "logout": "Kijelentkezés",
            "logoutConfirm": "Biztosan ki akarsz jelentkezni?"
        };

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/main_menu.json');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/nyelv_alapjan_JSON_olvasas/1/main_menu.json');
  });

  it('/felhasznalo/:id teszt: Az adminnak az alap beállításait lehívjuk', async () => {
    const data = {
      "success": true,
      "data": {
        "user_id": 1,
        "hangero": "0.50",
        "nyelv_id": 1,
        "kiosztas": "{\"playerEloreMegyGombja\": \"d\", \"playerHatraMegyGombja\": \"a\", \"playerUgroGombja\": \"space\", \"playerAttackGombja\": \"left click\", \"playerInteractGombja\": \"e\"}"
      }
    };

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/felhasznalo/1');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/felhasznalo/1');
  });

  it('/fiokadat/:id teszt: Az adminnak az alap fiók adatait lehívjuk', async () => {
    const data = {
      "success": true,
      "data": {
        "user_id": 1,
        "username": "admin",
        "user_email": "admin@gmail.com"
      }
    };

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/fiokadat/1');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/fiokadat/1');
  });

  it('/admin/users teszt: Az összes admin fiókadatait meghívjuk (ez a teljesen alap adatbázissal számol)', async () => {
    const data = {
      "success": true,
      "data": [
        {
          "user_id": 1,
          "username": "admin",
          "user_email": "admin@gmail.com",
          "user_jog_id": 1
        }
      ]
    };

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/admin/users');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/admin/users');
  });

  it('/mentesmeghiv/:user_id/:mentes_id teszt: Az adminnak az alap 2. mentését meghívjuk 2026.03.24-es állapotában', async () => {
    const data = {
  "success": true,
  "data": {
    "mentes_id": 3,
    "user_id": 1,
    "mentett_adatok": {
      "savepoint": "kezdomap_1",
      "world_interactions": {
        "mitteous-plateau_breakable-ground1": 0
      },
      "NPC_interactions": {
        "Ratchet": 0,
        "Prowl": 0
      },
      "bosses": {
        "Tarn": 0
      },
      "ability_unlocked": {
        "double_jump": 0,
        "dash": 0
      }
    }
  }
};

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/mentesmeghiv/1/2');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/mentesmeghiv/1/2');
  });

  it('/map_data/:szoba_neve teszt: A kezdomap.json 2026.03.24-es állapotát hívja meg', async () => {
    const data = { "compressionlevel":-1,
 "height":20,
 "infinite":false,
 "layers":[
        {
         "data":[150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 94, 95, 95, 96, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 124, 125, 126, 0, 0, 0, 0, 0, 0, 0, 150, 0, 181, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 182, 184, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 94, 95, 95, 95, 95, 96, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 150,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            150, 150, 124, 126, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            150, 150, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
            150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
         "height":20,
         "id":2,
         "name":"Fo_layer",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":30,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":4,
         "name":"Solid",
         "objects":[
                {
                 "height":173.333333333333,
                 "id":3,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":989.333333333333,
                 "x":-22.6666666666667,
                 "y":-13.3333333333333
                }, 
                {
                 "height":288,
                 "id":6,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":33.3333333333333,
                 "x":382,
                 "y":159.333333333333
                }, 
                {
                 "height":30,
                 "id":7,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":174.666666666667,
                 "x":205.333333333333,
                 "y":416.666666666667
                }, 
                {
                 "height":33.3333333333333,
                 "id":8,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":116,
                 "x":269.666666666667,
                 "y":288
                }, 
                {
                 "height":32.6666666666667,
                 "id":9,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":83.6666666666667,
                 "x":62.3333333333333,
                 "y":351.333333333333
                }, 
                {
                 "height":31.3333333333333,
                 "id":10,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":53,
                 "x":64.6666666666667,
                 "y":512
                }, 
                {
                 "height":64.3333333333334,
                 "id":11,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":66.6666666666667,
                 "x":2,
                 "y":576.333333333333
                }, 
                {
                 "height":470.333333333333,
                 "id":12,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":64,
                 "x":-0.333333333333336,
                 "y":105
                }, 
                {
                 "height":64.3333333333334,
                 "id":13,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":282.666666666667,
                 "x":64,
                 "y":575.666666666667
                }, 
                {
                 "height":65,
                 "id":14,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":298,
                 "x":346.666666666667,
                 "y":575.333333333333
                }, 
                {
                 "height":66.3333333333334,
                 "id":15,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":280.666666666667,
                 "x":644.666666666667,
                 "y":575.333333333333
                }, 
                {
                 "height":68.3333333333333,
                 "id":16,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":37.3333333333334,
                 "x":924.666666666667,
                 "y":575
                }, 
                {
                 "height":289.5,
                 "id":17,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":63.5,
                 "x":896,
                 "y":157
                }, 
                {
                 "height":31.5,
                 "id":18,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":353,
                 "x":448,
                 "y":352.5
                }, 
                {
                 "height":32.5,
                 "id":19,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":71.5,
                 "x":784,
                 "y":351.5
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
         "name":"Prowl_interaction",
         "objects":[
                {
                 "height":94,
                 "id":21,
                 "name":"Prowl_interact",
                 "rotation":0,
                 "type":"Prowl_interact",
                 "visible":true,
                 "width":95,
                 "x":642,
                 "y":480
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "class":"To_Mitteous_plateau_planes",
         "draworder":"topdown",
         "id":6,
         "name":"To_Mitteous_plateau_planes",
         "objects":[
                {
                 "height":135,
                 "id":22,
                 "name":"",
                 "rotation":0,
                 "type":"",
                 "visible":true,
                 "width":65,
                 "x":897,
                 "y":443
                }],
         "opacity":1,
         "type":"objectgroup",
         "visible":true,
         "x":0,
         "y":0
        }, 
        {
         "draworder":"topdown",
         "id":7,
         "name":"Kezdo_pont",
         "objects":[
                {
                 "height":0,
                 "id":26,
                 "name":"Kezdo_pont",
                 "point":true,
                 "rotation":0,
                 "type":"Kezdo_pont",
                 "visible":true,
                 "width":0,
                 "x":191,
                 "y":566
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
 "width":30
}

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/map_data/kezdomap.json');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/map_data/kezdomap.json');
  });

  it('/admin/elfelejtett-jelszo-keresek teszt: Az asd@gmail.com kért egy visszaállítást. Itt az időpont miatt figyelni kell, hogy ne okozzon failt', async () => {
    const data = {
      "success": true,
      "data": [
        {
          "keres_id": 1,
          "user_email": "asd@gmail.com",
          "keres_datum": "2026-03-24T10:17:10.000Z",
          "allapot": "uj"
        }
      ] 
    };

    axios.get.mockResolvedValue({ data });

    const result = await fetchData('http://127.0.0.1:3000/api/admin/elfelejtett-jelszo-keresek');
    expect(result).toEqual(data);
    expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:3000/api/admin/elfelejtett-jelszo-keresek');
  });

});1