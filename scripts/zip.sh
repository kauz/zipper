#!/usr/bin/env bash
src=$1;
dest=$2;
name=$3;
compression=$4;
compression=${compression:-6};
destfilepath=$dest'/'$name

error_exit()
{
  echo "$1" 1>&2
  exit 1
}

if [ $src ] && [ $dest ] && [ $name ]; then
  cd $src || error_exit "No such directory \"$src\""
  mkdir -p $dest || error_exit "Can not create dest \"$dest\""
  zip -r -q -$compression $destfilepath . || error_exit "Can not pack \"$src\""

else
  echo "Bad params";
fi
