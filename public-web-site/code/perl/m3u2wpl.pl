#!/usr/bin/perl

use strict;
use warnings;

#####################
#
# Creates WPL playlist from m3u8 playlist
#
# Example Usage: cat songs.m3u8 | ./m3u2wpl.pl > songs.wpl
#
# To convert m3u8 files from cygwin to m3u files that can be dragged onto and opeded with Windows Media Player, use this command: $ sed 's/\/cygdrive\/c/C:/' Songs.m3u8 | sed 's/\//\\/g' > Songs.m3u
#
#####################

my @songs= <>;
chomp(@songs);

print "<?wpl version=\"1.0\"?>\n";
print "<smil>\n";
print "\t<head>\n";
print "\t\t<meta name=\"Generator\" content=\"Microsoft Windows Media Player -- 11.0.5721.5145\"/>\n";
print "\t\t<meta name=\"AverageRating\" content=\"33\"/>\n";
print "\t\t<meta name=\"TotalDuration\" content=\"1102\"/>\n";
print "\t\t<meta name=\"ItemCount\" content=\"3\"/>\n";
print "\t\t<author/>\n";
print "\t\t<title>Bach Organ Works</title>\n";
print "\t</head>\n";
print "\t<body>\n";
print "\t\t<seq>\n";

for(my $i= 0; $i<=$#songs; $i++) {
   #print $songs[$i], "\n";
   print "\t\t\t<media src=\"", $songs[$1], "\"/>\n";
}

print "\t\t</seq>\n";
print "\t</body>\n";
print "</smil>\n";
