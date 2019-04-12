# TrainScheduler


This is a "Train Scheduler" application that uses moment.js API to perform time related calculations.

This application contains a form that adds a train information in the database (Firebase).
User should input -
    1. Train Name
    2. Destination station
    3. First Train Time (HH:mm) in military time
    4. Frequency (in minutes)

When user clicks on "Submit" button, the user's input data is stored in a unique object in the database within Firebase (connection made in the application).

If even a single field/entry is missing content the application will trigger an alert requesting the user to enter data in all fields.

This data is then reflected in the table displayed for user to view it.

The table shows "Train Name", "Destination station", "Train Frequency (min)". 

Together with this user can also see time of "Next Arrival" of the train and how many "Minutes Away" is this train. Later 2 fields are calculated using "Moment.js" apis.


If the user wishes he/she can also Edit/Delete a particular train information.