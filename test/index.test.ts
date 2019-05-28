import { expect } from 'chai';
import { describe, it, after } from 'mocha';
import { Zipper } from '../src';
import { stat, unlink, readFile } from 'fs';
import { promisify } from 'util';
import { platform } from 'os';


context('Zipper', () => {

  describe('zip', () => {

    it('should zip file', async () => {
      const statAsync = promisify(stat);
      const source = './test/resources/zip';
      const destination = './test/resources/zip.zip';
      const size = platform() === 'win32' ? 129 : 179;

      await Zipper.zip({ src: source, dest: destination });

      const st = await statAsync(destination);
      expect(st.size).to.equal(size);
    });

    after(async () => {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync('./test/resources/zip.zip')
    });

  });


  describe('unzip', () => {

    it('should unzip file', async () => {
      const readFileAsync = promisify(readFile);
      const source = './test/resources/unzip/arch.zip';
      const destination = './test/resources';

      await Zipper.unzip({ src: source, dest: destination });

      const out = await readFileAsync(`${destination}/test.txt`, 'utf8');
      expect(out).to.equal('hello world\r\n');
    });

    after(async () => {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync('./test/resources/test.txt')
    });

  });


  describe('getFileContent', () => {

    it('should read content of archived file', async () => {
      const source = './test/resources/unzip/arch.zip';
      const filePath = 'test.txt';

      const content = await Zipper.getFileContent({ filePath, src: source });

      expect(content).to.equal('hello world\r\n');
    });

  });


  describe('tar', () => {

    it('should make tar archive from list of files', async () => {
      const statAsync = promisify(stat);
      const fileList = ['./test/resources/zip/test.txt'];
      const dest = './test/resources/zip.tar.gz';
      const size = 150;

      await Zipper.tar({ dest, fileList });

      const st = await statAsync(dest);
      expect(st.size).to.equal(size);
    });

    after(async () => {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync('./test/resources/zip.tar.gz')
    });

  });

});
