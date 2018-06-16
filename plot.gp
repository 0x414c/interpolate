set terminal wxt persist
set xlabel 'Sample (x)'
set ylabel 'Signal (s(x))'
#set offsets graph 0.01, 0.01, 0.01, 0.01
set grid xtics ytics
set style fill transparent solid 0.333
plot 'output.dat' using 1:2 title 's(x)' with fillsteps
