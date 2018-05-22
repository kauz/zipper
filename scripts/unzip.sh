#!/usr/bin/env bash
src=$1;
dest=$2;


error_exit()
{
  echo "$1" 1>&2
  exit 1
}


if [ $src ] && [ $dest ]; then
  mkdir -p $dest || error_exit "Can not create dest \"$dest\""
  unzip -o -q $src -d $dest || error_exit "Can not unzip \"$src\" to \"$dest\""
else
  echo "Bad params";
fi
