# How to run

1. Open two terminals seperately and cd to the client and server directory seperately.
2. Run "npm i" within both terminals once you are in both client and server directories.
3. Make sure you have mysql up and running within your computer. In case you do not, then go to https://dev.mysql.com/downloads/workbench/. MySQL workbench is recommended but feel free to download any other way you feel more confortable with. In case you do go for workbench, then follow the prompts while downloading and set "root" as user and "3322" as password. You can change the password later on, but set it as "3322" for now. 
4. Run the server first by running the command in the terminal "npm run devStart". 
5. Next, run the client by running the command in the terminal "npm run start"
6. You're all set. Your browser should deploy the page within localhost and you are ready to start engaging with the site.

# Interacting with the website

1. First register and then try to log in. This should take you to a new page called userpage. In case you see the sign in/sign out page, click on sign in again until you see the userpage with two buttons showing up.
2. Within userpage, click on download file.

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
