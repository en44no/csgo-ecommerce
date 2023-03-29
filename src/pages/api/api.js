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

export default api;