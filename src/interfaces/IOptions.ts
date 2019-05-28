export interface IOptions {
  src?: string;
  dest?: string;
  filePath?: string;
  name?: string;
  absolute?: boolean;
  overwrite?: boolean;
  compression?: any;
  fileList?: string[];
}

export interface IZipOptions extends IOptions {
  src: string;
  dest: string;
}

export interface IUnzipOptions extends IOptions {
  src: string;
  dest: string;
}

export interface IGetFileContentOptions extends IOptions {
  src: string;
  filePath: string;
}

export interface ITarOptions extends IOptions {
  dest: string;
  fileList: string[];
}
