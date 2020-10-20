//streamtape interfaces
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

export interface api_keys {
  login: String,
  key: String,
  folder_id: String
}

export interface remoteUploadRes {
  status: number,
  msg: string,
  result: remoteUploadInfo
}

export interface remoteUploadInfo {
  id: string,
  folderid: string
}

export interface renameRes {
  status: number,
  msg: string,
  result: boolean
}

export interface deleteRes {
  status: number,
  msg: string,
  result: boolean
}
