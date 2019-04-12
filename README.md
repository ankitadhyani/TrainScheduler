# TrainScheduler


This is a "Train Scheduler" application that uses moment.js API to perform time releted calculations.

This application contains a form that adds a train formation in the database (Firebase).
User should input -
    1. Train Name
    2. Destination station
    3. First Train Time (HH:mm) in military time
    4. Frequency (in minutes)

When user clicks on "Submit" button, the user's input data is stored in a unique object in the database within Firebase (connection made in the application).

This data is then reflected in the table displayed on the right for user to view it.

The table is shown "Train Name", "Destination station", "Train Frequency (min)". Together with this user can also see time of "Next Arrival" of the train and how many "Minutes Away" is this train. Later 2 fields are calculated using "Moment.js" apis.


If the user wishes he/she can also Edit/Delete a particular train information.