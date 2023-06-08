# Web Programming 

# Use the EPFBook App

This is a book app project.

## Installation

1. Install git 
    >sudo apt-get install git.
2. Install NVM (Node Version Manager) https://github.com/nvm-sh/nvm
3. Clone this repository to your local machine.
4. Open a terminal and navigate to the project's directory (EPFBOOK).
5. Run the following command to install the dependencies:
    >npm install


## Usage

1. After the installation is complete, you can start the app using the following command:
    >npm run dev

This will start the app with Nodemon, which automatically restarts the server when changes are made to the code.

2. Access the app by opening your web browser and navigating to http://localhost:3000

3. The username is admin and the password is admin.

## Dependencies

- bcrypt: ^5.1.0
- bcryptjs: ^2.4.3
- d3-fetch: ^3.0.1
- ejs: ^3.1.9
- express: ^4.18.2
- express-basic-auth: ^1.2.1

## Development dependencies

- nodemon: ^2.0.22

## License

This project is licensed under the ISC License.

# Deploy the EPFBook App

1. Install NGINX and configure it to work as a reverse proxy
    >sudo apt-get install nginx

2. Make a backup of the default configuration file
    >sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

3. Open the NGINX configuration file using a text editor
    >sudo nano /etc/nginx/sites-available/default

4. Replace 0.0.0.0:3000 with the appropriate IP address and port where your application is running. 
   Update the configuration file as shown below:
    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://0.0.0.0:3000;
            include /etc/nginx/proxy_params;
        }
    }

5. Save the file and exit the text editor.

6. Restart NGINX to apply the changes
    >sudo systemctl restart nginx

7. Open your server's URL in a browser, and you should be redirected to your site's homepage. 
   If you encounter a 502 error, make sure that your Node server is running.


# Rick and Morty API

Who is the character of id 5 in the Rick and Morty API?

 From the tool Insomnia, we are doing the following GET request:
    https://rickandmortyapi.com/api/character/5

 Based on the obtained answer, we can say that is Jerry Smith:
 
{
	"id": 5,
	"name": "Jerry Smith",
	"status": "Alive",
	"species": "Human",
	"type": "",
	"gender": "Male",
	"origin": {
		"name": "Earth (Replacement Dimension)",
		"url": "https://rickandmortyapi.com/api/location/20"
	},
	"location": {
		"name": "Earth (Replacement Dimension)",
		"url": "https://rickandmortyapi.com/api/location/20"
	},
	"image": "https://rickandmortyapi.com/api/character/avatar/5.jpeg",
	"episode": [
		"https://rickandmortyapi.com/api/episode/6",
		"https://rickandmortyapi.com/api/episode/7",
		"https://rickandmortyapi.com/api/episode/8",
		"https://rickandmortyapi.com/api/episode/9",
		"https://rickandmortyapi.com/api/episode/10",
		"https://rickandmortyapi.com/api/episode/11",
		"https://rickandmortyapi.com/api/episode/12",
		"https://rickandmortyapi.com/api/episode/13",
		"https://rickandmortyapi.com/api/episode/14",
		"https://rickandmortyapi.com/api/episode/15",
		"https://rickandmortyapi.com/api/episode/16",
		"https://rickandmortyapi.com/api/episode/18",
		"https://rickandmortyapi.com/api/episode/19",
		"https://rickandmortyapi.com/api/episode/20",
		"https://rickandmortyapi.com/api/episode/21",
		"https://rickandmortyapi.com/api/episode/22",
		"https://rickandmortyapi.com/api/episode/23",
		"https://rickandmortyapi.com/api/episode/26",
		"https://rickandmortyapi.com/api/episode/29",
		"https://rickandmortyapi.com/api/episode/30",
		"https://rickandmortyapi.com/api/episode/31",
		"https://rickandmortyapi.com/api/episode/32",
		"https://rickandmortyapi.com/api/episode/33",
		"https://rickandmortyapi.com/api/episode/35",
		"https://rickandmortyapi.com/api/episode/36",
		"https://rickandmortyapi.com/api/episode/38",
		"https://rickandmortyapi.com/api/episode/39",
		"https://rickandmortyapi.com/api/episode/40",
		"https://rickandmortyapi.com/api/episode/41",
		"https://rickandmortyapi.com/api/episode/42",
		"https://rickandmortyapi.com/api/episode/43",
		"https://rickandmortyapi.com/api/episode/44",
		"https://rickandmortyapi.com/api/episode/45",
		"https://rickandmortyapi.com/api/episode/46",
		"https://rickandmortyapi.com/api/episode/47",
		"https://rickandmortyapi.com/api/episode/48",
		"https://rickandmortyapi.com/api/episode/49",
		"https://rickandmortyapi.com/api/episode/50",
		"https://rickandmortyapi.com/api/episode/51"
	],
	"url": "https://rickandmortyapi.com/api/character/5",
	"created": "2017-11-04T19:26:56.301Z"
}
