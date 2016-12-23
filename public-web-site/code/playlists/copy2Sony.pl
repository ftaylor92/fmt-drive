#!/usr/bin/perl

use warnings;
use FileHandle;
use Shell;

############
#
# Script to copy a playlist onto Sony Digital Music Player
#
# ./copy2Sony.pl Playlists/JazzVocalists.m3u8 > a.sh;chmod 775 a.sh;./a.sh;rm a.sh 
#
# To make playlist: find music/JazzVocalists/ -name "*.mp3"  | sed s/music/\\/music/g > music\ files/Playlists/JazzVocalists.m3u8
#
############

die "Usage: $#ARGV <inputPlaylistFilePath>.\n" if $#ARGV < 0;

my $parentDir= "/cygdrive/c/usr/local/doc";
my $WMPPLAYLIST= new FileHandle;
my $SONG= new FileHandle;
$WMPPLAYLIST->open("< $ARGV[0]");
my $sh= Shell->new;

my $cline= "";
while($cline= $WMPPLAYLIST->getline()) {
	chomp $cline;
	my $fileName= "$cline";
	#my $fileName= "$parentDir$cline";
	print "cp \"$fileName\" $parentDir/playlist/\n";
}
