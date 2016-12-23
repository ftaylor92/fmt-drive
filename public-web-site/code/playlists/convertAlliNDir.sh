#!/usr/bin/bash

###############################
#
# Script to change parent direcoty of all Playlists in a directory
#
# usage: <directory of original playlists> <parent dir of original playlists> <parent dir of new playlists> <directory to put new playlists into>
# ex: ./convertAllinDir.sh ./Playlists/ -music bmusic ./newPlaylists/
#
#
###############################

args=("$@")
origPlaylistDir=${args[0]}
origPlaylistParentDir=${args[1]}
newPlaylistParentDir=${args[2]}
newDirPlaylist=${args[3]}

for fn in $( ls $origPlaylistDir ) ; do
	echo "sed 's/$origPlaylistParentDir/$newPlaylistParentDir/g' ${origPlaylistDir}$fn > ${newDirPlaylist}$fn";
	$( sed "s/$origPlaylistParentDir/$newPlaylistParentDir/g" ${origPlaylistDir}$fn > ${newDirPlaylist}$fn );
done

