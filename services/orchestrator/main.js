const sessions = [];
let nextId = 1;

function createSession(){
	const session = {
		id: nextId,
		status: "created"
	};
	nextId = nextId + 1;
	sessions.push(session);

	return session;
}

function findSession(id){
	for (let i = 0; i < sessions.length; i++) {
		if (id === sessions[i].id)
			return sessions[i];
	}
	return null;
}

const http = require("node:http");

const server = http.createServer((req, res) =>{
	if (req.method == "GET" && req.url == "/sessions"){
		res.writeHead(200, { "Content-Type": "application/json"});
		res.end(JSON.stringify(sessions));
		return;
	}
	res.writeHead(404);
	res.end("Not Found");
});

server.listen(3000, () => {
	console.log("Server running at http://localhost:3000")
});