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
    if (skin.Float < 0.15) {
      skin.Wear = 'Factory New';
      skin.WearShorter = 'FN';
    } else if (skin.Float < 0.38) {
      skin.Wear = 'Minimal Wear';
      skin.WearShorter = 'MW';
    } else if (skin.Float < 0.45) {
      skin.Wear = 'Field-Tested';
      skin.WearShorter = 'FT';
    } else if (skin.Float < 0.55) {
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

export default api;