This is the audiostreamlogger!

This project contains a multi-service Docker application for recording, cleaning, generating peak files, and serving a frontend for audio files. The setup uses Docker Compose to manage the services and their interactions.

Prerequisites

	•	Docker: Install Docker
	•	Docker Compose: Install Docker Compose

Project Structure

	•	recorder: Service to record audio files.
	•	cleaner: Service to clean up audio files.
	•	peakfilegenerator: Service to generate peak files from audio files.
	•	frontend: Service to provide a web interface to interact with audio files.
	•	audio: Directory to store audio files.
	•	settings.json: Configuration file for the application.

Getting Started

    1.	Clone the repository:
        git clone https://github.com/yourusername/audiostreamlogger.git
        cd audiostreamlogger

    2.	Build and run the application:
        docker-compose up --build

    3.	Access the application:
        Open your browser and navigate to http://localhost:9702.


Stopping the Application

    To stop the application, press Ctrl+C in the terminal where docker-compose up is running, or run:

Configuration

    The application is configured using the settings.json file. This file specifies the streams to be recorded, including their country, name, folder, and URL.

    Example settings.json:

    {
    "streams":
        [
            {
                "country":"Netherlands",
                "name":"station_1",
                "folder":"station1",
                "url":"https://stream.station1.nl/station1.mp3"
            },
            {
                "country":"Netherlands",
                "name":"station_2",
                "folder":"station2",
                "url":"https://stream.station2.nl/station2.mp3"
            }
        ]
    }

    In the .env file the port the webserver is hosted on can be changed. This is an example:
    
    PORT=9703