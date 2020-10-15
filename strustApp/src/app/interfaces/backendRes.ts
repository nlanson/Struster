export interface backendRes {
  name: String,
  fid: String
}

export interface Reg {
  status: number,
  msg: string,
  result:  combined
}

export interface folders {
  folders: Array<folder>

}

export interface folder {
  id: string,
  name: string

}

export interface combined {
  folders: Array<folders>,
  files: Array<file>
}

export interface file {
  name: string,
  size: number,
  link: string,
  created_at: string,
  downloads: number,
  linkid: string,
  convert: string
}
