#shows all tables with everything in it (only for tests, might has too big output)
DB_NAME=ti_hw_db
su postgres <<EOF
psql -U postgres  -d $DB_NAME -c "SELECT * FROM equipment;"
psql -U postgres  -d $DB_NAME -c "SELECT * FROM emploee;"
psql -U postgres  -d $DB_NAME -c "SELECT * FROM request;"
echo "Database '$DB_NAME' is above."
EOF
