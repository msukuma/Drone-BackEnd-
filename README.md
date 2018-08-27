Drone Tracker
=============
A prototype backend for a drone or really any other gps enabled device.

Simulation Set up
-----------------
1. Run `docker build -t drone_tracker .`
3. Run `docker run --name drone_tracker_simulation -p 8000:8000 -p 8001:8001 drone_tracker`
4. In your browser, navigate to [localhost:8000](localhost:8000). If all went well, you should see a table showing updates received from the drone simulator. **The simulation will run for 5 minutes.**
5. If you wish to stop the simulation run `docker container stop drone_tracker_simulation`
