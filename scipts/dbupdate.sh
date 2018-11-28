# (1) loads mysql dump from web app, (2) imports sql dump into opendata database, (3) exports table radar to tsv, (4) exports table record to tsv. 
# replace username and Password in the following command to be run as a cron job
webappuser=username \
&& webappw=password \
&& sqluser=opendata_verkehr \
&& sqlpw=password \
&& wget -O public_html/verkehrspolizei/mysqldump.sql https://$webappuser:$webappw@radardaten.fdn.iwi.unibe.ch/data/getmysqldump \
&& mysql -u $sqluser -p$password opendata_verkehrspolizeiradar < public_html/verkehrspolizei/mysqldump.sql \
&& mysql -u $sqluser -p$password --column-names=TRUE opendata_verkehrspolizeiradar -e "SELECT * from radar;" > public_html/verkehrspolizei/radar.tsv \
&& mysql -u $sqluser -p$password --column-names=TRUE opendata_verkehrspolizeiradar -e "SELECT * from record;" > public_html/verkehrspolizei/record.tsv 

# or as a oneliner: 
# webappuser=username && webappw=password && sqluser=opendata_verkehr && sqlpw=password && wget -O public_html/verkehrspolizei/mysqldump.sql https://$webappuser:$webappw@radardaten.fdn.iwi.unibe.ch/data/getmysqldump && mysql -u $sqluser -p$password opendata_verkehrspolizeiradar < public_html/verkehrspolizei/mysqldump.sql && mysql -u $sqluser -p$password --column-names=TRUE opendata_verkehrspolizeiradar -e "SELECT * from radar;" > public_html/verkehrspolizei/radar.tsv && mysql -u $sqluser -p$password --column-names=TRUE opendata_verkehrspolizeiradar -e "SELECT * from record;" > public_html/verkehrspolizei/record.tsv 
