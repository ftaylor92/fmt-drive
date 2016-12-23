#!/usr/bin/perl

use strict;
use warnings;
use FileHandle;

############
#
#Script to convert Windows Media Player Playlists to text.
#
# perl wmp2rockbox.pl Spanish\ 2008.wpl | sed 's/"\/>//g'
# perl wmp2rockbox.pl Greatest\ Hits.wpl
#
############

die "Usage: $#ARGV <inputPlaylistFilePath>.\n" if $#ARGV < 0;

my $parentDir= "/music";
my $WMPPLAYLIST= new FileHandle;
$WMPPLAYLIST->open("< $ARGV[0]");

my $i= -1;
my $cline= "";
while($cline= $WMPPLAYLIST->getline()) {
    if($cline=~ /media/) {
	$i++;
	$cline=~ s/\s*<media\s*src="(.+)" cid=".+"\/>/$1/;
	$cline=~ s/\s*<media src="(.*)"\/>/$1/g;
	$cline=~ s/&apos;/\'/;
	$cline=~ s/\\/\//g;
	$cline=~ s/\.\.//g;
	print "$parentDir$cline";
    }
}
