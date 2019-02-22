set terminal wxt raise persist
set xlabel 'Sample (x)'
set ylabel 'Signal (s(x))'
set grid xtics ytics
plot 'output.dat' using 1:2 title 's(x)' with impulses
