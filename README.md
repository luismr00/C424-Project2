<!-- # Basic Front-End with Database Manipulation

For  all  parts  of  this  project,  your  system  must  be  application  or  web-based.  Some  simple  GUI 
interfaces  are  required  for  each  functionality.  All  functionality  must  be  performed  via  the 
interface of your system

##  Use Java/C#/PHP/Python and SQL, implement the following functionality: 
1. Create a database schema and implement a user registration and login interface so 
that only a registered user can login into the system. The schema of the user table should be:  
user(username, password, firstName, lastName, email) 
username is the primary key, and email should be unique. You have to prevent the SQL 
injection attack. There is an attached pdf file about SQL injection attacks. 
 
2. Sign  up  for  a  new  user  with  information  such  as:  username,  password,  password 
confirmed, first name, last name, email. Duplicate username, and email should be detected 
and fail the signup. Unmatching passwords should be detected, as well.  
 
3. Implement  a  button  called  “Initialize  Database.”  When  a  user  clicks  it,  all 
necessary  tables  will  be  created  (or  recreated)  automatically.  It should  use  the 
username “comp440” and possibly password “pass1234”.  

## Notes
1) For step 2, you can use the attached university.sql for now. Later you will replace this .sql 
script file with the SQL  file of your project database. Open the university.sql file in any text 
editor and change the database name in line 20. Make sure the database name is the same as the 
database of step 1 (user registration and login).  

2) This is a team project. You are allowed to find and reused codes; however, make sure to 
refer to the original source. 

### Contributions
Anthony Magana did majority work on the database side for phase 1. Implemented functions for initilizing,posting, and retrieval of data from the database.

Luis Rangel worked on UI such as form entry and password validation.

Tristin Greenstein worked on React.js front end and bug fixes on both UI and database.

### https://youtu.be/MTyv9AaGbac -->
