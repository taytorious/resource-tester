#!/bin/zsh




echo $1
echo $3

phantomprocess="$3 --local-to-remote-url-access=true --load-images=true --ignore-ssl-errors=true --web-security=false loadreport.js $1 $4 performance json &"

for ((i = 0; i<$2; i++))
do
 echo "Start test"
 $phantomprocess & echo $!
 for ((j=0; j< 60;j++ ))
 do
   if ps -p $!;then
	sleep 1
   	echo "sleep 1 second" 
   fi	
 done
 if ps -p $!;then
	kill $!
 fi

done




