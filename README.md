# sign-in-web
This is the web portal portion of my final year project. 
It is a React.js web app that lecturers can use to view statistics about their classes.

![Web Portal Screenshot](https://i.imgur.com/8OLvmpU.png)

Lecturers can sign up with their University of Limerick ID numbers and their timetable will be scraped automatically.
They do not need to add their students manually, they will be added automatically when the student signs up.

## To Run

First make sure the [backend server](https://github.com/colmlg/sign-in-backend) is running locally.  
If you want to run the backend elsewhere, edit `src/Constants.js`.  

Then to start the web portal server:  
```
npm install
npm start
```

and navigate to http://localhost:3001 in your browser.
There is a demo user set up by default. To test it out login with the credentials `test_lecturer`, `password`.
