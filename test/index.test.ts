import { expect } from 'chai';
import { describe, it, after } from 'mocha';
import { Zipper } from '../src';
import { stat, unlink, readFile } from 'fs';
import { promisify } from 'util';


context('Zipper', () => {

  describe('zip', () => {

    it('should zip file', async () => {
      const statAsync = promisify(stat);
      const source = './test/resources/zip';
      const destination = './test/resources/zip.zip';

      await Zipper.zip({ src: source, dest: destination });

      const st = await statAsync(destination);
      expect(st.size).to.equal(179);
    });

    after(async () => {
      const unlinkAsync = promisify(unlink);
      await unlinkAsync('./test/resources/zip.zip')
    });

  });


  describe('unzip', () => {

    it('should unzip file', async () => {
      const readFileAsync = promisify(readFile);
      const source = './test/resources/unzip/arch';
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

});
