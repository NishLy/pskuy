export default class cookies {
  static get(key: string) {
    if (typeof window !== "undefined") {
      let doc = document.cookie;
      if (doc === undefined) doc = "";
      const splat = doc.split(/;\s*/);
      for (let i = 0; i < splat.length; i++) {
        const ps = splat[i].split("=");
        const k = ps[0];
        if (k === key) return ps[1];
      }
    }
    return undefined;
  }

  static set(
    key: string,
    value: string,
    opts?: { expires?: string; path?: string; domain?: string; secure?: string }
  ) {
    if (!opts) opts = {};
    let s = key + "=" + value;
    if (opts.expires) s += "; expires=" + opts.expires;
    if (opts.path) s += "; path=" + opts.path;
    if (opts.domain) s += "; domain=" + opts.domain;
    if (opts.secure) s += "; secure";
    document.cookie = s;
    return s;
  }

  static delete(name: string) {
    document.cookie = name + "=; Max-Age=-99999999;";
  }

  static destroy() {
    if (typeof window !== "undefined") {
      document.cookie.split(";").forEach((e) => {
        const cookie = e.split("=")[0];
        document.cookie = cookie + "=;Max-Age=-99999999;";
      });
    }
  }
}
