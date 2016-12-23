#!/usr/bin/perl

use warnings;
use FileHandle;
use Shell;
use File::Path;

############
#
#Script to copy mp3s as wma files into a directory 
#
# ./copyToPhone.pl Playlists/JazzVocalists.m3u8 
#
# To make playlist: find music/JazzVocalists/ -name "*.mp3"  | sed s/^\\.\\//\\//g > music\ files/Playlists/JazzVocalists.m3u8
#
############

die "Usage: $#ARGV <inputPlaylistFilePath>.\n" if $#ARGV < 0;

my $parentDir= "c:/usr/local/doc";
my $WMPPLAYLIST= new FileHandle;
my $SONG= new FileHandle;
$WMPPLAYLIST->open("< $ARGV[0]");
my $sh= Shell->new;

my $cline= "";
while($cline= $WMPPLAYLIST->getline()) {
	chomp $cline;
	my $origFilePath= "$parentDir$cline";
	my $fileName= substr $cline, 2, index($cline, "\.mp3")- 2;
	my $directory= substr $cline, 2, rindex($cline, "\/") -1;
	
	my $newDirectory= "$parentDir/motorolaV3m/$directory";
	mkpath($newDirectory);
	#print "$newDirectory\n"; 
	my $lameCmd= "lame \"$origFilePath\" \"$parentDir/motorolaV3m/$fileName.wma\"";
	print "$lameCmd\n";
	system($lameCmd);
}
