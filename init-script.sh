echo "Deleting user records..."
psql -U postgres -d nestjs -c "DELETE FROM user;"