import Papa from 'papaparse';

const api = {
  skins: {
    get: async () => {
      const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRklk0av-7Tz2X8dSMawN17jGNL_KTpkkcFMKaXGG3n4mlobxtG--GG_KaaXw7sEPLymoTMyd-fMc9-/pub?gid=0&output=csv';

      const res = await fetch(url);
      const data = await res.text();

      const parsed = await new Promise((resolve, reject) => {
        Papa.parse(data, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      setSkinWear(parsed.data);
      setTradeLockDays(parsed.data);
      setStickers(parsed.data);
      orderByLowerFloat(parsed.data);

      return parsed.data;
    }
  },
  contact: {
    get: async () => {
      const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRklk0av-7Tz2X8dSMawN17jGNL_KTpkkcFMKaXGG3n4mlobxtG--GG_KaaXw7sEPLymoTMyd-fMc9-/pub?gid=643709188&output=csv';

      const res = await fetch(url);
      const data = await res.text();

      const parsed = await new Promise((resolve, reject) => {
        Papa.parse(data, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      return parsed.data;
    }
  },
  info: {
    get: async () => {
      const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRklk0av-7Tz2X8dSMawN17jGNL_KTpkkcFMKaXGG3n4mlobxtG--GG_KaaXw7sEPLymoTMyd-fMc9-/pub?gid=2126436044&output=csv';

      const res = await fetch(url);
      const data = await res.text();

      const parsed = await new Promise((resolve, reject) => {
        Papa.parse(data, {
          header: true,
          complete: resolve,
          error: reject,
        });
      });

      return parsed.data[0];
    }
  }
}

function setSkinWear(skins) {
  skins.forEach(skin => {
    if (skin.Float < 0.07) {
      skin.Wear = 'Factory New';
      skin.WearShorter = 'FN';
    } else if (skin.Float < 0.15) {
      skin.Wear = 'Minimal Wear';
      skin.WearShorter = 'MW';
    } else if (skin.Float < 0.38) {
      skin.Wear = 'Field-Tested';
      skin.WearShorter = 'FT';
    } else if (skin.Float < 0.45) {
      skin.Wear = 'Well-Worn';
      skin.WearShorter = 'WW';
    } else {
      skin.Wear = 'Battle-Scarred';
      skin.WearShorter = 'BS';
    }
  });
}

function setTradeLockDays(skins) {
  skins.forEach(skin => {
    const now = new Date();
    const nowWithoutHours = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const parts = skin.TradeLock.split("/");
    const tradeLockDateObject = new Date(parts[2], parts[1] - 1, parts[0]);

    if (tradeLockDateObject < nowWithoutHours) {
      skin.TradeLock = null;
      return;
    }

    const diffTime = Math.abs(now - tradeLockDateObject);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    skin.TradeLock = (diffDays == 1 ? '<1d' : `${diffDays}d`);
  })
}

function setStickers(skins) {

  skins.forEach((skin) => {
    let stickers = [];

    if (skin.Sticker1) {
      stickers.push({
        Link: skin.Sticker1,
        Nombre: skin.Sticker1Nombre,
      });
    }

    if (skin.Sticker2) {
      stickers.push({
        Link: skin.Sticker2,
        Nombre: skin.Sticker2Nombre,
      });
    }

    if (skin.Sticker3) {
      stickers.push({
        Link: skin.Sticker3,
        Nombre: skin.Sticker3Nombre,
      });
    }

    if (skin.Sticker4) {
      stickers.push({
        Link: skin.Sticker4,
        Nombre: skin.Sticker4Nombre,
      });
    }

    delete skin.Sticker1;
    delete skin.Sticker1Nombre;
    delete skin.Sticker2;
    delete skin.Sticker2Nombre;
    delete skin.Sticker3;
    delete skin.Sticker3Nombre;
    delete skin.Sticker4;
    delete skin.Sticker4Nombre;

    skin.Stickers = stickers;
  });
}

function orderByLowerFloat(skins) {
  // skins.sort((a, b) => {
  //   return a.Float - b.Float;
  // });
}

export default api;