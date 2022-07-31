create TABLE users( 
  id SERIAL PRIMARY KEY, 
  name VARCHAR(255), 
  email VARCHAR(255),
  password VARCHAR(255), 
  dateReg Date,
  dateLastLogin Date,
  status VARCHAR(255)
  );