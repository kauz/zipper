# Zipper


## Usage

```javascript
import { Zipper} from './src';

setImmediate( async () => {

  await Zipper.zip({src: '/path/to/something', dest: 'path/to/out.zip'});

  await Zipper.unzip( {src: 'path/to/inp.zip', dest: 'path/to/unzip'});

  const data = await Zipper.getFileContent({src: 'path/to/archive', filePath: 'filenameInsideArchive.csv'});

  await Zipper.tar( {dest: 'path/to/out.tar.gz', fileList: ['file1.xml, file2.csv']});

});
```
