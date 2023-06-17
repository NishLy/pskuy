export enum CONSOLE_TYPE {
  playstation = "playstation",
  xbox = "xbox",
  nitendo = "nitendo",
}

export enum STORAGE_TYPE {
  ssd = "ssd",
  hdd = "hdd",
  dvd = "dvd",
}

export enum MANUFACTUR {
  sony = "sony",
  microsoft = "microsoft",
  nitendo = "nitendo",
}

export interface CONSOLE_DATA {
  id?: string;
  name?: string;
  type?: CONSOLE_TYPE | undefined;
  type_storage?: STORAGE_TYPE | undefined;
  manufactur?: MANUFACTUR | undefined;
}
